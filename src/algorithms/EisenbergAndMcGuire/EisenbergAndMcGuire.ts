import { Idle, Yield } from "../../utility";

const IDLE = 13;
const IN_CS = 99;
const WANT_IN = 42;

interface Context {
  flag: Int8Array;
  turn: number;
  process_count: number;
}

function extract(context): Context {
  return {
    flag: new Int8Array(context.flag),
    turn: new Int8Array(context.turn)[0],
    process_count: context.process_count,
  };
}

async function lock(context, i) {
  let { process_count, flag, turn } = extract(context);
  let j;
  do {
    flag[i] = WANT_IN;
    j = turn;
    self.postMessage({ type: "sync_store", flag });
    await Yield();

    while (j != i) {
      await Yield();
      if (flag[j] != IDLE) {
        j = turn;
      } else {
        j += 1;
        j %= process_count;
      }
    }

    flag[i] = IN_CS;
    self.postMessage({ type: "sync_store", flag });

    j = 0;
    while (j < process_count && (j === i || flag[j] !== IN_CS)) {
      await Yield();
      j += 1;
    }
    if (j >= process_count && (turn == i || flag[turn] == IDLE)) {
      break;
    }
  } while (true);
  turn = i;
  self.postMessage({ type: "sync_store", flag, turn });
}

async function unlock(context, i) {
  let { flag, turn, process_count } = extract(context);
  let pid = (turn + 1) % process_count;
  while (true) {
    await Yield();
    pid += 1;
    pid %= process_count;
    if (flag[pid] !== IDLE) {
      break;
    }
  }
  turn = pid;
  flag[i] = IDLE;
  self.postMessage({ type: "sync_store", turn, flag });
}

self.onmessage = async (ev) => {
  const { me, context } = ev.data;
  await lock(context, me);
  self.postMessage({ type: "pre", who: ev.data.me });
  await Idle();
  self.postMessage({ type: "post", who: ev.data.me });
  await unlock(context, me);
  self.postMessage({ type: "done", who: ev.data.me });
};
