import type { Readable, Writable } from "svelte/store";
import { writable } from "svelte/store";
import type IProcess from "./IProcess";
import type { IProcessQuery } from "./IProcess";
import { ProcessLifeCycle } from "./IProcessLifeCycle";
import type IProgram from "./IProgram";
import { LockingState } from "./IProgram";
import { spawn, Thread } from "threads";
import { Observable, Subject } from "threads/observable";
import debug from "debug";
import { isUndefined } from "lodash-es";

export default class WebWorkerProcess implements IProcess {
  execution_state: Readable<ProcessLifeCycle>;
  program: IProgram;
  private readonly _source = new Subject();
  private readonly wait_spawn: Promise<void>;
  get source() {
    return Observable.from(this._source);
  }
  private impl: any = null;
  private readonly note: debug.Debugger;

  async kill(): Promise<void> {
    await this.wait_spawn;
    await Thread.terminate(this.impl);
  }

  async pause(): Promise<void> {
    await this.wait_spawn;
    await this.impl.request_pause();
  }

  async resume(): Promise<void> {
    await this.wait_spawn;
    await this.impl.resume();
  }

  async start(): Promise<void> {
    await this.wait_spawn;
    await this.impl.run(this.pid, this.shard_memory);
  }

  async set_breakpoint(to_be: boolean): Promise<void> {
    await this.wait_spawn;
    if (to_be) {
      await this.impl.enable_breakpoints();
    } else {
      await this.impl.disable_breakpoints();
    }
  }

  constructor(
    private readonly builder: () => Worker,
    public readonly pid: number,
    private readonly shard_memory
  ) {
    this.note = debug(`WebWorkerProcess[${pid}]`);
    const sub = (msg) => {
      this._source.next(msg);
    };
    this.wait_spawn = (async () => {
      const c = await spawn(this.builder());
      await c.memory_msg().subscribe(sub);
      await c.core_msg().subscribe(sub);
      await c.debug_msg().subscribe(sub);
      await Thread.events(c).subscribe(sub);
      this.note("spawned.");
      this.impl = c;
    })();
    const ob = new WebWorkerProcessObserver(this.pid, this.source);
    this.program = ob.program;
    this.execution_state = ob.execution_state;
  }
}

function make_filter(interested: string[]) {
  const s = new Set(interested);
  return (ev) => s.has(ev.type);
}

class WebWorkerProcessObserver implements IProcessQuery {
  public program: IProgram;
  public execution_state: Writable<ProcessLifeCycle>;
  private readonly note: debug.Debugger;
  constructor(
    public readonly pid: number,
    private readonly source: Observable<any>
  ) {
    this.note = debug(`WebWorkerProcessObserver[${pid}]`);
    this.execution_state = writable(ProcessLifeCycle.ready);
    this.program = new LockCriticalRegionUnlockProgram(this.source);
    this.source
      .filter(make_filter(["ready", "paused", "running", "completed"]))
      .subscribe(this.sub.bind(this));
  }
  private sub(ev: any) {
    const s = ProcessLifeCycle[ev.type];
    if (isUndefined(s)) {
      this.note(`ProcessLifeCycle[${ev.type}] is undefined`);
    } else {
      this.execution_state.set(s);
    }
  }
}

class LockCriticalRegionUnlockProgram implements IProgram {
  locking_state = writable(LockingState.Locking);
  line_number = writable(0);
  constructor(private readonly source: Observable<any>) {
    this.source
      .filter(make_filter(["lineno", "pre", "post"]))
      .subscribe(this.sub.bind(this));
  }
  private sub(ev: any) {
    switch (ev.type) {
      case "lineno": {
        return this.line_number.set(ev.payload);
      }
      case "pre": {
        return this.locking_state.set(LockingState.Locked);
      }
      case "post": {
        return this.locking_state.set(LockingState.Unlocked);
      }
    }
  }
}
