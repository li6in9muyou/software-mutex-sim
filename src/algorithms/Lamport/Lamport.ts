import { max } from "lodash";
import { Idle, Yield } from "../../utility";

const TRUE = 99;
const FALSE = -99;

interface Context {
  flag: Int8Array;
  label: Int8Array;
}

function extract(context): Context {
  return {
    flag: new Int8Array(context.flag),
    label: new Int8Array(context.label),
  };
}

function should_wait(context: Context, i: number): boolean {
  const { label, flag } = extract(context);
  return Array.from(label)
    .map((ticket, idx) => [ticket, idx])
    .filter(([, pid]) => pid !== i)
    .filter(([, pid]) => flag[pid] === TRUE)
    .map(([ticket, pid]) => (ticket === label[i] ? pid < i : ticket < label[i]))
    .some((i) => i);
}

async function lock(context, i) {
  const { flag, label } = extract(context);
  flag[i] = TRUE;
  label[i] = max(label) + 1;
  self.postMessage({ type: "sync_store", flag, label });
  do {
    await Yield();
  } while (should_wait(context, i));
}

function unlock(context, i) {
  const { flag } = extract(context);
  flag[i] = FALSE;
  self.postMessage({ type: "sync_store", flag });
}

self.onmessage = async (ev) => {
  const { me, context } = ev.data;
  await lock(context, me);
  self.postMessage({ type: "pre", who: ev.data.me });
  await Idle();
  self.postMessage({ type: "post", who: ev.data.me });
  unlock(context, me);
  self.postMessage({ type: "done", who: ev.data.me });
};
