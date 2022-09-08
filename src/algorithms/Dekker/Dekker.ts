import { Idle } from "../../utility";

interface RawCtx {
  wants_to_enter: ArrayBuffer;
  turn: ArrayBuffer;
}

const TRUE = 99;
const FALSE = -99;

interface CookedCtx {
  wants_to_enter: Int8Array;
  turn: number;
}

function counterpart(id) {
  return id === 1 ? 0 : 1;
}

function extract(context: RawCtx): CookedCtx {
  return {
    wants_to_enter: new Int8Array(context.wants_to_enter),
    turn: new Int8Array(context.turn)[0],
  };
}

async function lock(context: RawCtx, id) {
  const { wants_to_enter, turn } = extract(context);
  wants_to_enter[id] = TRUE;
  self.postMessage({ type: "sync_store", wants_to_enter });
  while (TRUE === wants_to_enter[counterpart(id)]) {
    if (!turn === id) {
      wants_to_enter[id] = FALSE;
      self.postMessage({ type: "sync_store", wants_to_enter });
      while (turn !== id) {
        // busy waiting
      }
      wants_to_enter[id] = TRUE;
      self.postMessage({ type: "sync_store", wants_to_enter });
    }
  }
}

function unlock(context: RawCtx, id) {
  let { wants_to_enter, turn } = extract(context);
  turn = counterpart(id);
  wants_to_enter[id] = FALSE;
  self.postMessage({ type: "sync_store", turn, wants_to_enter });
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
