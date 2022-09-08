import { Idle } from "../../utility";
import { every } from "lodash";

const process_count = 10;

function can_proceed(me, waiting_room_idx, l, v) {
  const level = new Int8Array(l);
  const victim = new Int8Array(v);
  const at_highest_level = every(
    Array.from(level)
      .filter((val, idx) => idx !== me)
      .map((val) => val < waiting_room_idx)
  );
  return victim[waiting_room_idx] != me || at_highest_level;
}

async function lock(me, l, v) {
  const level = new Int8Array(l);
  const victim = new Int8Array(v);
  for (let i = 1; i < process_count; i++) {
    level[me] = i;
    victim[i] = me;
    self.postMessage({ type: "sync_store", level, victim });
    do {} while (!can_proceed(me, i, l, v));
  }
}

function unlock(me, l) {
  const level = new Int8Array(l);
  level[me] = 0;
  self.postMessage({ type: "sync_store", level });
}

async function lock_adapter(d) {
  const { me, level: l, victim: v } = d;
  await lock(me, l, v);
}

function unlock_adapter(d) {
  const { me, level: l } = d;
  unlock(me, l);
}

self.onmessage = async (ev) => {
  await lock_adapter(ev.data);
  self.postMessage({ type: "pre", who: ev.data.me });
  await Idle();
  self.postMessage({ type: "post", who: ev.data.me });
  unlock_adapter(ev.data);
  self.postMessage({ type: "done", who: ev.data.me });
};
