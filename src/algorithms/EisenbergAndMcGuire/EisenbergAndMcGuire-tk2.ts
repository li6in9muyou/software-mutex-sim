import { expose } from "threads";
import ImportBaseProcessModule from "../../use_case/BaseProcess";
import { Idle, Yield } from "../utility";
import { WANT_IN, IDLE, IN_CS } from "./constants";
import { useMonitoredMemory } from "../../use_case/MemoryWriteSync";
const { Demo, break_point: bp } = ImportBaseProcessModule();

async function lock(use_msg, who, memory) {
  const [dbg, , mPipe] = use_msg();
  dbg.next("lock received args: ", memory);
  const { flag, turn } = useMonitoredMemory(mPipe, memory);
  dbg.next("memory", flag, turn);
  const process_count = flag.length;

  const i = who;
  let j;
  do {
    await bp(3);
    flag[i] = WANT_IN;
    j = turn[0];

    while (j != i) {
      await bp(5);
      await Yield();
      if (flag[j] != IDLE) {
        j = turn[0];
      } else {
        j += 1;
        j %= process_count;
      }
    }
    await bp(13);
    flag[i] = IN_CS;
    await bp(14);
    j = 0;
    while (j < process_count && (j === i || flag[j] !== IN_CS)) {
      j += 1;
    }
    await bp(18);
    if (j >= process_count && (turn[0] == i || flag[turn[0]] == IDLE)) {
      break;
    }
    await Yield();
  } while (true);
  await bp(22);
  turn[0] = i;
  await bp(101);
}

async function unlock(use_msgs, who, memory, process_count) {
  const [dbg, , mPipe] = use_msgs();
  const { flag, turn } = useMonitoredMemory(mPipe, memory);
  await bp(50);
  let pid = (turn[0] + 1) % process_count;
  while (true) {
    pid += 1;
    pid %= process_count;
    await bp(54);
    await Yield();
    if (flag[pid] !== IDLE) {
      break;
    }
  }
  await bp(58);
  turn[0] = pid;
  await bp(59);
  flag[who] = IDLE;

  dbg.next("unlock");
  await bp(102);
}

expose(Demo(lock, unlock, Idle));
