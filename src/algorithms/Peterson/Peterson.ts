import { Idle } from "../../utility";
import { identity, isUndefined } from "lodash";
import type { IContext } from "../../Labour";
import Labour from "../../Labour";

export function build_worker() {
  return new Worker(new URL("./helper.ts", import.meta.url), {
    type: "module",
  });
}

export function build_init_context(process_count) {
  return {
    level: new SharedArrayBuffer(process_count),
    victim: new SharedArrayBuffer(process_count),
    process_count,
  };
}

export function sync_memory_to_store(level_store, victim_store, context) {
  const { level, victim } = context;
  if (!isUndefined(level)) {
    level_store.set(level);
  }
  if (!isUndefined(victim)) {
    victim_store.set(victim);
  }
}

interface IPetersonContext extends IContext {
  level: Int8Array;
  victim: Int8Array;
}

export class Peterson extends Labour {
  process_count;

  constructor(who: number, context: IPetersonContext) {
    super(who, context, Idle);
    this.process_count = context.process_count;
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
