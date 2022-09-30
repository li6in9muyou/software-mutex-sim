import StartManyProcesses from "./StartManyProcesses";
import { Observable, Subject } from "threads/observable";

export default class StartManyProcessesAndObserve {
  private readonly source = new Subject();
  private readonly startManyProcesses: StartManyProcesses;

  constructor(process_count: number, process_url: URL) {
    const sub = (msg) => this.source.next(msg);
    this.startManyProcesses = new StartManyProcesses(
      process_count,
      process_url,
      sub,
      sub,
      sub
    );
  }
  get processes_handle() {
    return this.startManyProcesses;
  }
  get messages() {
    return Observable.from(this.source);
  }
}
