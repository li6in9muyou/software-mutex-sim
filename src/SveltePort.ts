import { derived, writable } from "svelte/store";
import type { Readable, Writable } from "svelte/store";
import { critical_region, critical_region_new, Idle } from "./utility";

export function use_critical_region(process_id) {
  return (fn) => async (args) => {
    enter_critical_region(process_id);
    await fn(args);
    exit_critical_region(process_id);
  };
}

export const N_PROCESS = 2;

export const process_status = writable(
  Array(N_PROCESS)
    .fill(null)
    .map(() => false)
);

export const those_in_critical_region = derived(process_status, (status) => {
  return status
    .map((in_critical, idx) => (in_critical ? idx : -1))
    .filter((i) => i >= 0);
});

export const those_contending = derived(process_status, (status) => {
  return status
    .map((in_critical, idx) => (!in_critical ? idx : -1))
    .filter((i) => i >= 0);
});

export function enter_critical_region(id) {
  process_status.update((status) => {
    status[id] = true;
    return status;
  });
}

export function exit_critical_region(id) {
  process_status.update((status) => {
    status[id] = false;
    return status;
  });
}

export class SveltePort {
  readonly process_count: number;
  readonly those_contending: Readable<number[]>;
  readonly those_in_critical_region: Readable<number[]>;
  readonly process_status: Writable<boolean[]>;

  constructor(process_count = 10) {
    this.process_count = process_count;
    this.process_status = writable(
      Array(this.process_count)
        .fill(null)
        .map(() => false)
    );
    this.those_in_critical_region = derived(this.process_status, (status) => {
      return status
        .map((in_critical, idx) => (in_critical ? idx : -1))
        .filter((i) => i >= 0);
    });
    this.those_contending = derived(this.process_status, (status) => {
      return status
        .map((in_critical, idx) => (!in_critical ? idx : -1))
        .filter((i) => i >= 0);
    });
  }

  private pre_critical_region(id) {
    this.process_status.update((status) => {
      status[id] = true;
      return status;
    });
  }

  private post_critical_region(id) {
    this.process_status.update((status) => {
      status[id] = false;
      return status;
    });
  }

  async execute_critical_region(id) {
    this.pre_critical_region(id);
    await Idle();
    this.post_critical_region(id);
  }
}
