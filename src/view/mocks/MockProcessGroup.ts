import type { Readable, Writable } from "svelte/store";
import type IProcessGroup from "../../use_case/IProcessGroup";
import type { IProcessGroupQuery } from "../../use_case/IProcessGroup";
import type IProcess from "../../use_case/IProcess";
import type { IProcessCommand } from "../../use_case/IProcess";
import { constant, times } from "lodash";
import { readable, writable } from "svelte/store";
import { ProcessLifeCycle } from "../../use_case/IProcessLifeCycle";
import type IProgram from "../../use_case/IProgram";
import { LockingState } from "../../use_case/IProgram";
import debug from "debug";
import { sleep } from "../../algorithms/utility";

export default class MockProcessGroup implements IProcessGroup {
  readonly memory: Map<string, Readable<Array<number>>>;
  readonly process_count: number = 13;
  readonly all: IProcessGroupQuery & IProcessCommand;
  private readonly _exec_state: Writable<ProcessLifeCycle>[];
  private readonly _prog: IProgram[];
  private readonly _processes: IProcess[];
  private readonly note: debug.Debugger;

  async noop() {
    return;
  }

  constructor() {
    this.note = debug("MockProcessGroup");
    this._prog = times(this.process_count, () => ({
      locking_state: readable(LockingState.Locking),
      line_number: readable(0),
    }));
    this._exec_state = times(this.process_count, () =>
      writable(ProcessLifeCycle.ready)
    );
    this.all = {
      program: this._prog,
      execution_state: this._exec_state,
      start: this.noop.bind(this),
      resume: this.noop.bind(this),
      pause: this.noop.bind(this),
      kill: this.noop.bind(this),
      set_breakpoint: this.noop.bind(this),
    };
    this.memory = new Map([
      ["level", readable(times(this.process_count, constant(1989)))],
      ["turn", readable(Array.of(42))],
    ]);

    this._processes = times(this.process_count, (pid) => ({
      start: this.wait_then_set(pid, ProcessLifeCycle.running),
      resume: this.wait_then_set(pid, ProcessLifeCycle.running),
      pause: this.wait_then_set(pid, ProcessLifeCycle.paused),
      kill: this.noop.bind(this),
      set_breakpoint: this.noop.bind(this),
      program: this._prog[pid],
      execution_state: this._exec_state[pid],
      pid,
    }));
  }

  pid(pid: number): IProcess {
    return this._processes[pid];
  }

  wait_then_set(pid: number, expected: ProcessLifeCycle, milliseconds = 1000) {
    return async () =>
      sleep(milliseconds).then(() => {
        this._exec_state[pid].set(expected);
      });
  }
}
