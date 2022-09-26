import { derived, writable } from "svelte/store";
import type { Readable, Writable } from "svelte/store";

export class SveltePort {
  readonly process_count: number;
  readonly those_contending: Readable<number[]>;
  readonly those_in_critical_region: Readable<number[]>;
  readonly is_process_in_critical_region: Writable<boolean[]>;

  constructor(process_count = 10) {
    this.process_count = process_count;
    this.is_process_in_critical_region = writable(
      Array(this.process_count)
        .fill(null)
        .map(() => false)
    );
    this.those_in_critical_region = derived(
      this.is_process_in_critical_region,
      (status) => {
        return status
          .map((in_critical, idx) => (in_critical ? idx : -1))
          .filter((i) => i >= 0);
      }
    );
    this.those_contending = derived(
      this.is_process_in_critical_region,
      (status) => {
        return status
          .map((in_critical, idx) => (!in_critical ? idx : -1))
          .filter((i) => i >= 0);
      }
    );
  }

  pre_critical_region(id) {
    this.is_process_in_critical_region.update((status) => {
      status[id] = true;
      return status;
    });
  }

  post_critical_region(id) {
    this.is_process_in_critical_region.update((status) => {
      status[id] = false;
      return status;
    });
  }
}
