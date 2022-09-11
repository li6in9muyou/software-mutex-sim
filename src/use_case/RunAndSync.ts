import type { Writable } from "svelte/store";
import { SveltePort } from "../SveltePort";
import { range, shuffle } from "lodash";
import { spawn, Pool, Thread } from "threads";

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
  private readonly process_count: number;
  private readonly build_worker: () => Worker;
  private readonly build_init_context: () => IMemory;
  private readonly memory_store: MemoryStore<IMemory>;
  private readonly on_sync_store: (IMemory) => void;
  private readonly iteration_count: number;

  constructor(
    process_count: number,
    memory_store: MemoryStore<IMemory>,
    build_worker: () => Worker,
    build_init_context: () => IMemory,
    on_sync_store: (IMemory) => void,
    iteration_count = 10
  ) {
    this.process_count = process_count;
    this.port = new SveltePort(process_count);
    this.memory_store = memory_store;
    this.build_worker = build_worker;
    this.build_init_context = build_init_context;
    this.on_sync_store = on_sync_store;
    this.iteration_count = iteration_count;
  }

  private handlePoolWorkerMessage(ev) {
    switch (ev.type) {
      case "message": {
        switch (ev.data.type) {
          case "result":
          case "running": {
            console.log("worker: ", ev.data);
            break;
          }
          default: {
            this.handleLabourMessage(ev.data);
            break;
          }
        }
        break;
      }
      case "termination": {
        console.log("one worker exited");
        break;
      }
      default: {
        console.warn("unknown worker msg: ", ev);
        break;
      }
    }
  }

  private handleLabourMessage(d) {
    const port = this.port;
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
        console.log(`process ${d.who} completes one iteration`);
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
  }

  async start() {
    const process_count = this.process_count;

    const exec_pool = Pool(
      () =>
        spawn(this.build_worker()).then((thread) => {
          Thread.events(thread).subscribe(
            this.handlePoolWorkerMessage.bind(this)
          );
          return thread;
        }),
      { size: 2 }
    );

    for (let i = 0; i < this.iteration_count; i += 1) {
      const context = this.build_init_context();
      for (const pid of shuffle(range(0, process_count))) {
        exec_pool.queue(async (w) => {
          await w({ me: pid, context });
        });
      }
      console.log("done spawning");
    }
    await exec_pool.completed();
    console.log("pool completed");
    await exec_pool.terminate();
    console.log("pool terminated");
  }
}
