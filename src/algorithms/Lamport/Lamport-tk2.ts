import { expose } from "threads";
import {
  Demo,
  pause_stub,
  useMonitoredMemory,
} from "../../use_case/BaseProcess";
import { Idle } from "../../utility";
import { max } from "lodash";

const TRUE = 99;
const FALSE = -99;

function should_wait(pid: number, ...memory: Int32Array[]): boolean {
  const [label, flag] = memory;
  return Array.from(label)
    .map((ticket, idx) => [ticket, idx])
    .filter(([, pid]) => pid !== pid)
    .filter(([, pid]) => flag[pid] === TRUE)
    .map(([ticket, pid]) =>
      ticket === label[pid] ? pid < pid : ticket < label[pid]
    )
    .some((i) => i);
}

async function lock(use_msg, pid, memory, process_count) {
  const [dbg, c, mPipe] = use_msg();
  dbg.next("lock received args: ", memory, process_count);
  const { flag, label } = useMonitoredMemory(mPipe, memory);
  dbg.next("memory", flag, label);

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
  const [mPipe, c, dbg] = use_msgs();
  c.next(["post", who]);

  await pause_stub();
  const { flag } = useMonitoredMemory(mPipe, memory);
  flag[who] = FALSE;

  dbg.next("unlock");
  await pause_stub();
}

expose(Demo(lock, unlock, Idle));
