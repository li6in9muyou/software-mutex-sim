import { expose } from "threads";
import { Demo, pause_stub } from "../../use_case/BaseProcess";
import { Idle } from "../../utility";
import { max } from "lodash";
import { FALSE, TRUE } from "./constants";
import { useMonitoredMemory } from "../MemoryWriteSync";

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
  const [dbg, c, mPipe] = use_msg();
  dbg.next("lock received args: ", memory, process_count);
  const { flag, label } = useMonitoredMemory(mPipe, memory);
  dbg.next("memory", flag, label);

  await pause_stub();
  flag[pid] = TRUE;
  await pause_stub();
  label[pid] = max(label) + 1;
  await pause_stub();
  do {
    await pause_stub();
  } while (should_wait(pid, label, flag));
  await pause_stub();

  c.next(["pre", pid]);
}

async function unlock(use_msgs, who, memory) {
  const [dbg, c, mPipe] = use_msgs();
  c.next(["post", who]);

  await pause_stub();
  const { flag } = useMonitoredMemory(mPipe, memory);
  flag[who] = FALSE;

  dbg.next("unlock");
  await pause_stub();
}

expose(Demo(lock, unlock, Idle));
