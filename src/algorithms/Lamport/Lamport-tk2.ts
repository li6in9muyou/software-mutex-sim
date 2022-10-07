import { expose } from "threads";
import ImportBaseProcessModule from "../../use_case/BaseProcess";
import { Idle, Yield } from "../utility";
import { max } from "lodash";
import { FALSE, TRUE } from "./constants";
import { useMonitoredMemory } from "../../use_case/MemoryWriteSync";

const { Demo, break_point, pause_stub } = ImportBaseProcessModule();

function should_wait(who: number, ...memory: Int32Array[]): boolean {
  const [label, flag] = memory;
  return Array.from(label)
    .map((ticket, idx) => [ticket, idx])
    .filter(([, pid]) => pid !== who)
    .filter(([, pid]) => flag[pid] === TRUE)
    .map(([ticket, pid]) =>
      ticket === label[who] ? pid < who : ticket < label[who]
    )
    .some((i) => i);
}

async function lock(use_msg, pid, memory, process_count) {
  const [dbg, , mPipe] = use_msg();
  dbg.next("lock received args: ", memory, process_count);
  const { flag, label } = useMonitoredMemory(mPipe, memory);
  dbg.next("memory", flag, label);

  flag[pid] = TRUE;
  await break_point(1);
  label[pid] = max(label) + 1;
  await break_point(2);
  await break_point(3);
  do {
    await Yield();
  } while (should_wait(pid, label, flag));
  await break_point(4);
}

async function unlock(use_msgs, who, memory) {
  const [dbg, , mPipe] = use_msgs();

  await pause_stub();
  const { flag } = useMonitoredMemory(mPipe, memory);

  flag[who] = FALSE;
  await break_point(5);

  dbg.next("unlock");
  await pause_stub();
}

expose(Demo(lock, unlock, Idle));
