import { expose } from "threads";
import { Demo, pause_stub } from "../../use_case/BaseProcess";
import { Idle } from "../../utility";
import { WANT_IN, IDLE, IN_CS } from "./constants";
import { useMonitoredMemory } from "../../use_case/MemoryWriteSync";

async function lock(use_msg, who, memory, process_count) {
  const [dbg, , mPipe] = use_msg();
  dbg.next("lock received args: ", memory, process_count);
  const { flag, turn } = useMonitoredMemory(mPipe, memory);
  dbg.next("memory", flag, turn);

  const i = who;
  let j;
  do {
    await pause_stub();
    flag[i] = WANT_IN;
    j = turn[0];

    while (j != i) {
      await pause_stub();
      if (flag[j] != IDLE) {
        j = turn[0];
      } else {
        j += 1;
        j %= process_count;
      }
    }
    await pause_stub();
    flag[i] = IN_CS;
    await pause_stub();
    j = 0;
    while (j < process_count && (j === i || flag[j] !== IN_CS)) {
      j += 1;
    }
    await pause_stub();
    if (j >= process_count && (turn[0] == i || flag[turn[0]] == IDLE)) {
      break;
    }
  } while (true);
  await pause_stub();
  turn[0] = i;
  await pause_stub();
}

async function unlock(use_msgs, who, memory, process_count) {
  const [dbg, , mPipe] = use_msgs();
  const { flag, turn } = useMonitoredMemory(mPipe, memory);
  await pause_stub();
  let pid = (turn[0] + 1) % process_count;
  while (true) {
    pid += 1;
    pid %= process_count;
    await pause_stub();
    if (flag[pid] !== IDLE) {
      break;
    }
  }
  await pause_stub();
  turn[0] = pid;
  await pause_stub();
  flag[who] = IDLE;

  dbg.next("unlock");
}

expose(Demo(lock, unlock, Idle));
