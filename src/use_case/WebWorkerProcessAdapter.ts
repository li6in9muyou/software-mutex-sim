import type { Readable } from "svelte/store";
import { derived } from "svelte/store";
import type IProcess from "./IProcess";
import { ProcessLifeCycle } from "./IProcessLifeCycle";
import type IProgram from "./IProgram";
import { LockingState } from "./IProgram";
import { spawn, Thread } from "threads";
import { Observable, Subject } from "threads/observable";
import debug from "debug";
import RunningSync, { ProcessState } from "./RunningSync";
import ContendingOrNot, {
  type ContendingOrNotEvent,
} from "../port/ContendingOrNot";
import { SveltePort } from "../port/SveltePort";
import { isNull } from "lodash";

export default class WebWorkerProcess implements IProcess {
  private exec_convert(old: ProcessState): ProcessLifeCycle {
    switch (old) {
      case ProcessState.completed:
        return ProcessLifeCycle.completed;
      case ProcessState.paused:
        return ProcessLifeCycle.paused;
      case ProcessState.ready:
        return ProcessLifeCycle.ready;
      case ProcessState.running:
        return ProcessLifeCycle.running;
    }
  }

  private locking_convert(
    acquired: Readable<boolean[]>
  ): Readable<LockingState> {
    return derived(acquired, (arr, set) => {
      const next_state = arr[0] ? LockingState.Locked : LockingState.Unlocked;
      this.note(`program.locking_state = ${next_state}`);
      set(next_state);
    });
  }

  private toProgram(rs: RunningSync, con: ContendingOrNot): IProgram {
    con.attach(this.source as Observable<ContendingOrNotEvent>);
    const [overview, ,] = con.get_stores_overview_contending_acquired();
    return {
      line_number: rs.lineno[0],
      locking_state: this.locking_convert(overview),
    };
  }

  private toExecState(rs: RunningSync): Readable<ProcessLifeCycle> {
    return derived(rs.running, (arr, set) => {
      const processLifeCycle = this.exec_convert(arr[0]);
      this.note(`execution_state = ${processLifeCycle}`);
      set(processLifeCycle);
    });
  }

  execution_state: Readable<ProcessLifeCycle>;
  program: IProgram;
  private readonly _source = new Subject();
  get source() {
    return Observable.from(this._source);
  }
  private impl: any = null;
  private readonly note: debug.Debugger;

  async kill(): Promise<void> {
    if (!isNull(this.impl)) {
      await Thread.terminate(this.impl);
    }
  }

  async pause(): Promise<void> {
    await this.impl.request_pause();
  }

  async resume(): Promise<void> {
    await this.impl.resume();
  }

  async start(): Promise<void> {
    await this.impl.run(this.pid, this.shard_memory);
  }

  constructor(
    private readonly process_url: URL,
    public readonly pid: number,
    private readonly shard_memory
  ) {
    this.note = debug(`WebWorkerProcess[${pid}]`);
    const sub = (msg) => {
      this._source.next(msg);
    };
    (async () => {
      const c = await spawn(
        new Worker(this.process_url, {
          type: "module",
        })
      );
      await c.memory_msg().subscribe(sub);
      await c.core_msg().subscribe(sub);
      await c.debug_msg().subscribe(sub);
      await Thread.events(c).subscribe(sub);
      return c;
    })().then((p) => {
      this.note("spawned.");
      this.impl = p;
    });
    const rs = new RunningSync(1, this.source);
    this.program = this.toProgram(rs, new ContendingOrNot(new SveltePort(1)));
    this.execution_state = this.toExecState(rs);
  }
}
