import { Yield, Idle } from "../../utility";

const process_count = 10;

function should_wait(who, now, l, v) {
  const level = new Int8Array(l);
  const victim = new Int8Array(v);
  for (let k = 0; k < process_count; k++) {
    if (k !== who && level[k] >= now && victim[now] == who) {
      return true;
    }
  }
  return false;
}

async function lock(me, l, v) {
  const level = new Int8Array(l);
  const victim = new Int8Array(v);
  for (let i = 1; i < process_count; i++) {
    level[me] = i;
    victim[i] = me;
    do {
      await Yield();
    } while (should_wait(me, i, l, v));
  }
}

function unlock(me, l) {
  const level = new Int8Array(l);
  level[me] = 0;
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
  self.postMessage("locking");
  await lock_adapter(ev.data);
  self.postMessage("entered");
  await Idle();
  self.postMessage("done");
  unlock_adapter(ev.data);
  self.postMessage("unlocked");
};
