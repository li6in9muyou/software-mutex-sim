import { Idle } from "../../utility";
import type { IContext } from "../../Labour";
import Labour from "../../Labour";
import { isUndefined } from "lodash";

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
  console.assert(
    !isUndefined(me) && !isUndefined(context),
    "main thread should provide {who, context}"
  );
  const d = new Dekker(me, context);
  await d.run();
};
