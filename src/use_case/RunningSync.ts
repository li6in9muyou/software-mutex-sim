import { writable } from "svelte/store";
import type { Readable, Writable } from "svelte/store";
import type { Observable } from "threads/observable";
import debug from "debug";
import { constant, times } from "lodash";
const note = debug("RunningSync");

export enum ProcessState {
  running,
  paused,
  completed,
}

export type RunningSyncEvent =
  | { type: "completed"; payload: number }
  | {
      type: "lineno";
      payload: { pid: number; lineno: number; message?: string };
    }
  | { type: "paused"; payload: number }
  | { type: "running"; payload: number };

export default class RunningSync {
  private readonly _running: Writable<ProcessState[]>;
  get running(): Readable<ProcessState[]> {
    return this._running;
  }
  private readonly _lineno: Writable<number[]>;
  get lineno(): Readable<number[]> {
    return this._lineno;
  }

  constructor(
    private readonly process_count: number,
    private readonly source: Observable<any>
  ) {
    this._lineno = writable(times(process_count, constant(0)));
    this._running = writable(
      times(process_count, constant(ProcessState.running))
    );

    this.source
      .filter(
        (ev) =>
          ev.type === "paused" ||
          ev.type === "resumed" ||
          ev.type === "lineno" ||
          ev.type === "completed"
      )
      .subscribe(this.subscriber.bind(this));
  }

  private subscriber(ev: RunningSyncEvent) {
    note("run/pause %o", ev);
    switch (ev.type) {
      case "lineno": {
        this._lineno.update((arr) => {
          arr[ev.payload.pid] = ev.payload.lineno;
          return arr;
        });
        break;
      }
      case "paused": {
        this._running.update((arr) => {
          arr[ev.payload] = ProcessState.paused;
          return arr;
        });
        break;
      }
      case "running": {
        this._running.update((arr) => {
          arr[ev.payload] = ProcessState.running;
          return arr;
        });
        break;
      }
      case "completed": {
        this._running.update((arr) => {
          arr[ev.payload] = ProcessState.completed;
          return arr;
        });
        break;
      }
    }
  }
}
