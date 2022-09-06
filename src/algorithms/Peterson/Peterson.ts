import { Yield } from "../../utility";

const process_count = 10;
const level = Array(process_count).fill(0);
const victim = Array(process_count).fill(-999);

function should_wait(who, now) {
  for (let k = 0; k < process_count; k++) {
    if (k !== who && level[k] >= now && victim[now] == who) {
      return true;
    }
  }
  return false;
}

export async function lock(me) {
  for (
    let nth_waiting_room = 0;
    nth_waiting_room < process_count;
    nth_waiting_room++
  ) {
    level[me] = nth_waiting_room;
    victim[nth_waiting_room] = me;
    do {
      await Yield();
    } while (should_wait(me, nth_waiting_room));
  }
}

export async function unlock(me) {
  level[me] = 0;
}
