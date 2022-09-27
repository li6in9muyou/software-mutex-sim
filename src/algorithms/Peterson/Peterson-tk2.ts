import { expose } from "threads";
import { Demo, pause_stub } from "../../use_case/BaseProcess";
import { Idle, Yield } from "../../utility";
import { identity } from "lodash";
import { useMonitoredMemory } from "../../use_case/MemoryWriteSync";

function can_proceed(me, waiting_room_idx, l, v) {
  const at_highest_level = l
    .filter((val, idx) => {
      return idx !== me;
    })
    .map((val) => val < waiting_room_idx)
    .every(identity);
  return v[waiting_room_idx] != me || at_highest_level;
}

async function lock(use_msg, pid, memory, process_count) {
  const [dbg, c, mPipe] = use_msg();
  dbg.next("lock received args: ", memory, process_count);
  const { level, victim } = useMonitoredMemory(mPipe, memory);
  dbg.next("memory", level, victim);

  for (let i = 1; i < process_count; i++) {
    level[pid] = i;
    await pause_stub();
    victim[i] = pid;
    await pause_stub();
    do {
      await pause_stub();
      await Yield();
    } while (!can_proceed(pid, i, level, victim));
    await Yield();
  }
  c.next(["pre", pid]);
}

async function unlock(use_msgs, who, memory) {
  await pause_stub();
  const [dbg, c, mPipe] = use_msgs();
  c.next(["post", who]);
  const { level } = useMonitoredMemory(mPipe, memory);
  level[who] = 0;
  dbg.next("unlock");
}

expose(Demo(lock, unlock, Idle));
