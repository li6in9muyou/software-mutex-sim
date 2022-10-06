import ContendingOrNot from "../port/ContendingOrNot";
import { SveltePort } from "../SveltePort";
import SingleObservableAdapter from "./SingleObservableAdapter";
import { createMemorySyncStoreAndSync, type IMemory } from "./MemoryWriteSync";
import RunningSync from "./RunningSync";
import type IAlgorithmDef from "../algorithms/IAlgorithmDef";

export default class SimulationBuilder {
  public soa: SingleObservableAdapter;
  private memory: IMemory;
  constructor(private readonly algorithmDef: IAlgorithmDef) {
    const { process_count, algorithm_impl_url } = this.algorithmDef;
    this.soa = new SingleObservableAdapter(process_count, algorithm_impl_url);
  }
  get_stores() {
    const { process_count, prefix, get_memory } = this.algorithmDef;
    this.memory = get_memory(process_count);
    const [memory_store, m] = createMemorySyncStoreAndSync(this.memory);
    const con = new ContendingOrNot(prefix, new SveltePort(process_count));
    this.soa.messages.subscribe(con.core_message_handler);
    this.soa.messages.subscribe(con.debug_message_handler);
    this.soa.messages.subscribe(m);
    const runningSync = new RunningSync(process_count, this.soa.messages);
    const [is_in_region, ,] = con.get_stores_overview_contending_acquired();

    return {
      memory_store,
      running: runningSync.running,
      in_critical_region_or_not: is_in_region,
      lineno: runningSync.lineno,
    };
  }
  get_process_handle() {
    const soa = this.soa;

    return {
      runAll: () =>
        soa.processes_handle.run(this.memory, this.algorithmDef.process_count),
      runOne: (pid: number) =>
        soa.processes_handle.run_by_pid(
          pid,
          this.memory,
          this.algorithmDef.process_count
        ),
      resume: (pid: number) => soa.processes_handle.resume_by_pid(pid),
      resumeAll: () => soa.processes_handle.resume_all(),
      pause: (pid: number) => soa.processes_handle.pause_by_pid(pid),
      pauseAll: () => soa.processes_handle.pause_all(),
    };
  }
}
