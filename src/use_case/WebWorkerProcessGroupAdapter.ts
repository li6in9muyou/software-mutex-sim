import type IProcessGroup from "./IProcessGroup";
import type { IProcessGroupQuery } from "./IProcessGroup";
import type { Readable, Writable } from "svelte/store";
import type IProcess from "./IProcess";
import type { IProcessCommand } from "./IProcess";
import type { IMemory } from "./MemoryWriteSync";
import { createMemorySyncStoreAndSync } from "./MemoryWriteSync";
import WebWorkerProcess from "./WebWorkerProcessAdapter";
import { get, writable } from "svelte/store";
import debug from "debug";
import type { ProcessLifeCycle } from "./IProcessLifeCycle";
import type IProgram from "./IProgram";
const note = debug("WebWorkerProcessGroup");

export default class WebWorkerProcessGroup
  implements IProcessGroup, IProcessGroupQuery, IProcessCommand
{
  private readonly processes: IProcess[] = [];
  memory: Map<string, Writable<Array<number>>> = new Map();
  execution_state: Readable<ProcessLifeCycle>[];
  program: IProgram[];
  async kill(): Promise<void> {
    await Promise.all(this.processes.map((p) => p.kill()));
  }
  async pause(): Promise<void> {
    await Promise.all(this.processes.map((p) => p.pause()));
  }
  async resume(): Promise<void> {
    await Promise.all(this.processes.map((p) => p.resume()));
  }
  async start(): Promise<void> {
    await Promise.all(this.processes.map((p) => p.start()));
  }
  async set_breakpoint(to_be: boolean) {
    await Promise.all(this.processes.map((p) => p.set_breakpoint(to_be)));
  }
  get all(): IProcessGroupQuery & IProcessCommand {
    return this;
  }
  constructor(
    public readonly process_count: number,
    private readonly builder: () => Worker,
    private readonly get_memory: (process_count: number) => IMemory
  ) {
    const memory = this.get_memory(this.process_count);
    for (const memoryKey in memory) {
      this.memory.set(memoryKey, writable([]));
    }
    const [memory_store, memory_listener] =
      createMemorySyncStoreAndSync(memory);
    for (let pid = 0; pid < process_count; pid++) {
      const process = new WebWorkerProcess(this.builder, pid, memory);
      process.source.subscribe(memory_listener);
      this.processes.push(process);
    }
    memory_store.subscribe((stores) => {
      for (const storeKey in stores) {
        this.memory.get(storeKey).set(get(stores[storeKey]));
      }
    });
    this.execution_state = this.processes.map((p) => p.execution_state);
    this.program = this.processes.map((p) => p.program);
    note(`has ${process_count} processes`);
  }

  pid(pid: number): IProcess {
    return this.processes[pid];
  }
}
