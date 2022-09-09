import { Idle } from "../../utility";
import { identity } from "lodash";
import type { IContext } from "../../Labour";
import Labour from "../../Labour";

interface IPetersonContext extends IContext {
  level: Int8Array;
  victim: Int8Array;
}

class Peterson extends Labour {
  process_count;

  constructor(who: number, context: IPetersonContext, process_count: number) {
    super(who, context, Idle);
    this.process_count = process_count;
  }

  private can_proceed(me, waiting_room_idx, l, v) {
    const at_highest_level = l
      .filter((val, idx) => {
        return idx !== me;
      })
      .map((val) => val < waiting_room_idx)
      .every(identity);
    return v[waiting_room_idx] != me || at_highest_level;
  }

  protected lock_impl(context) {
    const { level, victim } = context;
    for (let i = 1; i < this.process_count; i++) {
      level[this.who] = i;
      victim[i] = this.who;
      do {} while (!this.can_proceed(this.who, i, level, victim));
    }
  }

  protected prepare_context_impl(context): IPetersonContext {
    return {
      level: new Int8Array(context.level),
      victim: new Int8Array(context.victim),
    };
  }

  protected unlock_impl(context) {
    context.level[this.who] = 0;
  }
}

self.onmessage = async (ev) => {
  const { me, level, victim, process_count = 10 } = ev.data;
  const d = new Peterson(me, { level, victim }, process_count);
  await d.run();
};
