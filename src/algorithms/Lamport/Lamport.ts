import { isUndefined, max } from "lodash";
import { Idle } from "../../utility";
import Labour from "../../Labour";
import type { IContext } from "../../Labour";

export function build_worker() {
  return new Worker(new URL("./Lamport.ts", import.meta.url), {
    type: "module",
  });
}

export function build_init_context(process_count) {
  return {
    flag: new SharedArrayBuffer(process_count),
    label: new SharedArrayBuffer(process_count),
  };
}

export function sync_memory_to_store(flag_store, label_store, context) {
  const { flag, label } = context;
  if (!isUndefined(flag)) {
    flag_store.set(Array.from(flag).map((v) => v === Lamport.TRUE));
  }
  if (!isUndefined(label)) {
    label_store.set(label);
  }
}

interface ILamportMemory extends IContext {
  flag: Int8Array;
  label: Int8Array;
}

class Lamport extends Labour {
  static TRUE = 99;
  static FALSE = -99;

  constructor(who: number, context: IContext) {
    super(who, context, Idle);
  }

  private should_wait(context: ILamportMemory): boolean {
    const { label, flag } = context;
    return Array.from(label)
      .map((ticket, idx) => [ticket, idx])
      .filter(([, pid]) => pid !== this.who)
      .filter(([, pid]) => flag[pid] === Lamport.TRUE)
      .map(([ticket, pid]) =>
        ticket === label[this.who] ? pid < this.who : ticket < label[this.who]
      )
      .some((i) => i);
  }

  protected lock_impl(context: ILamportMemory) {
    const { flag, label } = context;
    flag[this.who] = Lamport.TRUE;
    label[this.who] = max(label) + 1;
    do {} while (this.should_wait(context));
  }

  protected prepare_context_impl(context): ILamportMemory {
    return {
      flag: new Int8Array(context.flag),
      label: new Int8Array(context.label),
    };
  }

  protected unlock_impl(context) {
    context.flag[this.who] = Lamport.FALSE;
  }
}

self.onmessage = async (ev) => {
  const { me, context } = ev.data;
  await new Lamport(me, context).run();
};
