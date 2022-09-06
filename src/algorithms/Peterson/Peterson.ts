import { Yield } from "../../utility";
import { writable } from "svelte/store";

export const process_count = 10;
const level = Array(process_count).fill(0);
const victim = Array(process_count).fill(0);
export const victim_store = writable([]);
export const level_store = writable([]);

function should_wait(who, now) {
  for (let k = 0; k < process_count; k++) {
    if (k !== who && level[k] >= now && victim[now] == who) {
      return true;
    }
  }
  return false;
}

export async function lock(me) {
  for (let i = 1; i < process_count; i++) {
    level[me] = i + 1;
    victim[i] = me;
    level_store.set(level);
    victim_store.set(victim);
    do {
      await Yield();
    } while (should_wait(me, i));
  }
}

export async function unlock(me) {
  level[me] = 0;
  level_store.set(level);
}
