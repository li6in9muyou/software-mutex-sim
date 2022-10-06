import type SimulationBuilder from "./SimulationBuilder";
import Process from "./ProcessFacade";
import type IProcess from "./IProcess";
import type IProcessGroup from "./IProcessGroup";

export default class ProcessGroup implements IProcessGroup {
  static GetMany(sb: SimulationBuilder): ProcessGroup {
    return new ProcessGroup(sb);
  }

  private constructor(private readonly sb: SimulationBuilder) {}

  get_pid(pid: number): Process {
    return new Process(pid, this.sb);
  }

  get_store(label: string) {
    switch (label) {
      case "LifeCycle": {
        return this.sb.get_stores().running;
      }
      case "WhoIsIn": {
        return this.sb.get_stores().in_critical_region_or_not;
      }
      case "Memory": {
        return this.sb.get_stores().memory_store;
      }
      case "LineNumber": {
        return this.sb.get_stores().lineno;
      }
    }
  }

  pauseAll() {
    this.sb.get_process_handle().pauseAll();
  }

  resumeAll() {
    this.sb.get_process_handle().resumeAll();
  }

  runAll() {
    this.sb.get_process_handle().runAll();
  }

  killAll() {
    this.sb.soa.processes_handle.kill_all();
  }

  async_wrap = (fn) => () => {
    fn();
    return Promise.resolve();
  };

  private _all = {
    start: this.async_wrap(this.runAll),
    resume: this.async_wrap(this.resumeAll),
    pause: this.async_wrap(this.pauseAll),
    kill: this.async_wrap(this.killAll),
  };

  get all(): IProcess {
    return this._all;
  }

  pid(pid: number): IProcess {
    const { start, resume, pause, kill } = this.get_pid(pid);
    return {
      start: this.async_wrap(start),
      resume: this.async_wrap(resume),
      pause: this.async_wrap(pause),
      kill: this.async_wrap(kill),
    };
  }
}
