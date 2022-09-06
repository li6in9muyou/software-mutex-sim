import { derived, writable } from "svelte/store";

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
