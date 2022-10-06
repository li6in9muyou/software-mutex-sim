import { expose } from "threads";
import ImportBaseProcessModule from "../../use_case/BaseProcess";
import { Idle, Yield } from "../utility";
import { FALSE, TRUE } from "./constants";
import { useMonitoredMemory } from "../../use_case/MemoryWriteSync";
const { Demo, break_point } = ImportBaseProcessModule();

function counterpart(id: number) {
  return id === 1 ? 0 : 1;
}

async function lock(use_msg, who, memory) {
  const [dbg, , mPipe] = use_msg();
  dbg.next("lock received args: ", memory);
  const { wants_to_enter, turn } = useMonitoredMemory(mPipe, memory);
  dbg.next("memory", wants_to_enter, turn);

  await break_point(1);
  wants_to_enter[who] = TRUE;

  while (TRUE === wants_to_enter[counterpart(who)]) {
    await break_point(2);

    await break_point(4);
    if (turn[0] !== who) {
      await break_point(6);
      wants_to_enter[who] = FALSE;

      await break_point(7);
      while (turn[0] !== who) {
        // busy waiting
        await break_point(8);
        await Yield();
      }
      await break_point(9);
      wants_to_enter[who] = TRUE;
    }
  }
  await break_point(101);
}

async function unlock(use_msgs, who, memory) {
  const [dbg, , mPipe] = use_msgs();
  const { turn, wants_to_enter } = useMonitoredMemory(mPipe, memory);

  await break_point(51);
  wants_to_enter[who] = FALSE;
  await break_point(52);
  turn[0] = counterpart(who);
  dbg.next("unlock");
  await break_point(102);
}

expose(Demo(lock, unlock, Idle));
