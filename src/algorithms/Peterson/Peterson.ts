import { Yield } from "../../utility";

export const process_count = 10;
const l = new SharedArrayBuffer(process_count);
const v = new SharedArrayBuffer(process_count);

function should_wait(who, now) {
  const level = new Int8Array(l);
  const victim = new Int8Array(v);
  for (let k = 0; k < process_count; k++) {
    if (k !== who && level[k] >= now && victim[now] == who) {
      return true;
    }
  }
  return false;
}

export async function lock(me) {
  const level = new Int8Array(l);
  const victim = new Int8Array(v);
  console.log(me, "trys to lock", Array.from(level), Array.from(victim));
  for (let i = 1; i < process_count; i++) {
    level[me] = i + 1;
    victim[i] = me;
    console.log(Array.from(level), Array.from(victim));
    do {
      await Yield();
    } while (should_wait(me, i));
  }
}

export async function unlock(me) {
  const level = new Int8Array(l);
  level[me] = 0;
}
