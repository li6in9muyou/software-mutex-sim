import type SimulationBuilder from "./SimulationBuilder";
import { derived } from "svelte/store";

export default class Process {
  constructor(private readonly pid, private readonly sb: SimulationBuilder) {}

  get_store(label: string) {
    switch (label) {
      case "LifeCycle": {
        return derived(this.sb.get_stores().running, (arr) => arr[this.pid]);
      }
      case "Memory": {
        return derived(
          this.sb.get_stores().memory_store,
          (arr) => arr[this.pid]
        );
      }
      case "LineNumber": {
        return derived(this.sb.get_stores().lineno, (arr) => arr[this.pid]);
      }
    }
  }

  start() {
    this.sb.get_process_handle().runOne(this.pid);
  }

  pause() {
    this.sb.get_process_handle().pause(this.pid);
  }

  resume() {
    this.sb.get_process_handle().resume(this.pid);
  }

  kill() {
    throw new Error("not implemented");
  }
}
