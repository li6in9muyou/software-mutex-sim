import { expose } from "threads";
const { Demo, break_point } = ImportBaseProcessModule();
import { Idle, Yield } from "../utility";
import { identity } from "lodash-es";
import { useMonitoredMemory } from "../../use_case/MemoryWriteSync";
import ImportBaseProcessModule from "../../use_case/BaseProcess";

function can_proceed(me, waiting_room_idx, l, v) {
  const at_highest_level = l
    .filter((val, idx) => {
      return idx !== me;
    })
    .map((val) => val < waiting_room_idx)
    .every(identity);
  return v[waiting_room_idx] != me || at_highest_level;
}

async function lock(use_msg, pid, memory) {
  const [dbg, , mPipe] = use_msg();
  dbg.next("lock received args: ", memory);
  const { level, victim } = useMonitoredMemory(mPipe, memory);
  dbg.next("memory", level, victim);

  for (let i = 1; i < victim.length; i++) {
    await break_point(1);

    await break_point(2);
    level[pid] = i;

    await break_point(3);
    victim[i] = pid;

    await break_point(4);
    do {
      await break_point(100);
      await Yield();
      await Idle(Math.random() * 0.5 + 0.1);
    } while (!can_proceed(pid, i, level, victim));

    await break_point(5);
    await Yield();
  }
  await break_point(6);
  await break_point(101);
}

async function unlock(use_msgs, who, memory) {
  const [dbg, , mPipe] = use_msgs();
  const { level } = useMonitoredMemory(mPipe, memory);
  await break_point(7);
  level[who] = 0;
  dbg.next("unlock");
  await break_point(102);
}

expose(Demo(lock, unlock, Idle));
