import type { Writable } from "svelte/store";
import type Labour from "../Labour";
import { SveltePort } from "../SveltePort";
import { range, shuffle } from "lodash";
import { Yield } from "../utility";

type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

interface ILabourMemory {
  [context_name: symbol]: TypedArray;
}

type Memory = Writable<Array<number>>;

type MemoryStore<T> = {
  [context_name in keyof T]: Memory;
};

export class RunAndSync<IMemory> {
  port: SveltePort;
  private killed_process_count: number;
  private workers: Worker[];
  private readonly process_count: number;
  private readonly build_worker: () => Worker;
  private readonly build_init_context: () => IMemory;
  private readonly memory_store: MemoryStore<IMemory>;
  private readonly on_sync_store: (IMemory) => void;

  constructor(
    process_count: number,
    memory_store: MemoryStore<IMemory>,
    build_worker: () => Worker,
    build_init_context: () => IMemory,
    on_sync_store: (IMemory) => void
  ) {
    this.process_count = process_count;
    this.port = new SveltePort(process_count);
    this.memory_store = memory_store;
    this.build_worker = build_worker;
    this.build_init_context = build_init_context;
    this.on_sync_store = on_sync_store;
  }

  private buildHandleWorkerMessage(pid: number) {
    return (ev) => {
      const port = this.port;
      const workers = this.workers;

      const d = ev.data;
      switch (d.type) {
        case "pre": {
          port.pre_critical_region(d.who);
          break;
        }
        case "post": {
          port.post_critical_region(d.who);
          break;
        }
        case "done": {
          workers[d.who].terminate();
          console.log(`${d.who} is killed`);
          this.killed_process_count += 1;
          break;
        }
        case "sync_store": {
          this.on_sync_store(d);
          break;
        }
        default: {
          console.info(d);
          break;
        }
      }
    };
  }

  async start() {
    const process_count = this.process_count;

    while (true) {
      const workers = new Array(process_count)
        .fill(null)
        .map(this.build_worker);
      this.workers = workers;
      const context = this.build_init_context();

      this.killed_process_count = 0;
      for (const pid of shuffle(range(0, process_count))) {
        const w = workers[pid];
        w.onmessage = this.buildHandleWorkerMessage(pid);
        w.onerror = (ev) =>
          console.error(`${pid} error: ` + JSON.stringify(ev));
        w.postMessage({
          me: pid,
          context,
        });
      }

      console.log("done spawning");
      do {
        await Yield();
      } while (this.killed_process_count < process_count);
    }
  }
}
