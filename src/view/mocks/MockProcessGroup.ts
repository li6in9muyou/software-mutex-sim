import type { Readable } from "svelte/store";
import type IProcessGroup from "../../use_case/IProcessGroup";
import type { IProcessGroupQuery } from "../../use_case/IProcessGroup";
import type IProcess from "../../use_case/IProcess";
import type { IProcessCommand } from "../../use_case/IProcess";
import { times } from "lodash";
import { readable } from "svelte/store";
import { ProcessLifeCycle } from "../../use_case/IProcess";
import type IProgram from "../../use_case/IProgram";
import { LockingState } from "../../use_case/IProgram";

export default class MockProcessGroup implements IProcessGroup {
  readonly memory: Map<string, Readable<Array<number>>>;
  readonly process_count: number = 13;
  readonly all: IProcessGroupQuery & IProcessCommand;
  private readonly _exec_state: Readable<ProcessLifeCycle>[];
  private readonly _prog: IProgram[];
  private readonly _processes: IProcess[];

  async noop() {
    return;
  }

  constructor() {
    this._prog = times(this.process_count, () => ({
      locking_state: readable(LockingState.Locking),
      line_number: readable(0),
    }));
    this._exec_state = times(this.process_count, () =>
      readable(ProcessLifeCycle.ready)
    );
    this.all = {
      program: this._prog,
      execution_state: this._exec_state,
      start: this.noop.bind(this),
      resume: this.noop.bind(this),
      pause: this.noop.bind(this),
      kill: this.noop.bind(this),
    };
    this.memory = new Map([
      ["level", readable(Array.of(1989, 64, 2, 3))],
      ["turn", readable(Array.of(42))],
    ]);

    this._processes = times(this.process_count, (pid) => ({
      start: this.noop.bind(this),
      resume: this.noop.bind(this),
      pause: this.noop.bind(this),
      kill: this.noop.bind(this),
      program: this._prog[pid],
      execution_state: this._exec_state[pid],
      pid,
    }));
  }

  pid(pid: number): IProcess {
    return this._processes[pid];
  }
}
