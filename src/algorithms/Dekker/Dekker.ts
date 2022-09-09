import { Idle } from "../../utility";
import type { IContext } from "../../Labour";
import Labour from "../../Labour";
import { isUndefined } from "lodash";

export function build_worker() {
  return new Worker(new URL("./Dekker.ts", import.meta.url), {
    type: "module",
  });
}

export function build_init_context() {
  return {
    wants_to_enter: new SharedArrayBuffer(2),
    turn: new SharedArrayBuffer(1),
  };
}

export function sync_memory_to_store(
  wants_to_enter_store,
  turn_store,
  context
) {
  const { wants_to_enter, turn } = context;
  if (!isUndefined(wants_to_enter)) {
    wants_to_enter_store.set(
      Array.from(wants_to_enter).map((i) => i === Dekker.TRUE)
    );
  }
  if (!isUndefined(turn)) {
    turn_store.set(turn);
  }
}

interface IDekkerContext extends IContext {
  wants_to_enter: ArrayBuffer;
  turn: ArrayBuffer;
}

class Dekker extends Labour {
  static TRUE = 99;
  static FALSE = -99;

  constructor(who: number, context: IDekkerContext) {
    super(who, context, Idle);
  }

  private counterpart(id: number) {
    return id === 1 ? 0 : 1;
  }

  protected lock_impl(context: IDekkerContext) {
    const { wants_to_enter, turn } = context;
    wants_to_enter[this.who] = Dekker.TRUE;
    while (Dekker.TRUE === wants_to_enter[this.counterpart(this.who)]) {
      if (turn[0] !== this.who) {
        wants_to_enter[this.who] = Dekker.FALSE;
        while (turn[0] !== this.who) {
          // busy waiting
        }
        wants_to_enter[this.who] = Dekker.TRUE;
      }
    }
  }

  protected prepare_context_impl(context): IDekkerContext {
    return {
      wants_to_enter: new Int8Array(context.wants_to_enter),
      turn: new Int8Array(context.turn),
    };
  }

  protected unlock_impl(context) {
    context.turn[0] = this.counterpart(this.who);
    context.wants_to_enter[this.who] = Dekker.FALSE;
  }
}

self.onmessage = async (ev) => {
  const { me, context } = ev.data;
  await new Dekker(me, context).run();
};
