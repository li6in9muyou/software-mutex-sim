import type SimulationBuilder from "./SimulationBuilder";
import Process from "./ProcessFacade";

export default class ProcessGroup {
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
    this.sb.get_process_handle().pause_all();
  }

  resumeAll() {
    this.sb.get_process_handle().resumeAll();
  }

  runAll() {
    this.sb.get_process_handle().runAll();
  }
}
