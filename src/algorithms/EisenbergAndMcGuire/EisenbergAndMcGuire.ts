import { Idle } from "../../utility";
import Labour from "../../Labour";
import type { IContext } from "../../Labour";

const IDLE = 13;
const IN_CS = 99;
const WANT_IN = 42;

interface IEisenbergAndMcGuireMemory extends IContext {
  flag: Int8Array;
  turn: Int8Array;
}

class EisenbergAndMcGuire extends Labour {
  private readonly process_count: number;

  constructor(who: number, process_count: number, context: IContext) {
    super(who, context, Idle);
    this.process_count = process_count;
  }

  protected lock_impl(context: IEisenbergAndMcGuireMemory) {
    const i = this.who;
    const process_count = this.process_count;
    let { flag, turn } = context;

    let j;
    do {
      flag[i] = WANT_IN;
      j = turn[0];

      while (j != i) {
        if (flag[j] != IDLE) {
          j = turn[0];
        } else {
          j += 1;
          j %= process_count;
        }
      }

      flag[i] = IN_CS;

      j = 0;
      while (j < process_count && (j === i || flag[j] !== IN_CS)) {
        j += 1;
      }
      if (j >= process_count && (turn[0] == i || flag[turn[0]] == IDLE)) {
        break;
      }
    } while (true);
    turn[0] = i;
  }

  protected prepare_context_impl(context): IEisenbergAndMcGuireMemory {
    return {
      flag: new Int8Array(context.flag),
      turn: new Int8Array(context.turn),
    };
  }

  protected unlock_impl(context) {
    let { flag, turn, process_count } = context;
    let pid = (turn[0] + 1) % process_count;
    while (true) {
      pid += 1;
      pid %= process_count;
      if (flag[pid] !== IDLE) {
        break;
      }
    }
    turn[0] = pid;
    flag[this.who] = IDLE;
  }
}

self.onmessage = async (ev) => {
  const { me, context } = ev.data;
  await new EisenbergAndMcGuire(me, context.process_count, context).run();
};
