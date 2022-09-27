import { expose } from "threads";
import { Demo, pause_stub } from "../../use_case/BaseProcess";
import { Idle } from "../../utility";
import { FALSE, TRUE } from "./constants";
import { useMonitoredMemory } from "../MemoryWriteSync";

function counterpart(id: number) {
  return id === 1 ? 0 : 1;
}

async function lock(use_msg, who, memory) {
  const [dbg, c, mPipe] = use_msg();
  dbg.next("lock received args: ", memory);
  const { wants_to_enter, turn } = useMonitoredMemory(mPipe, memory);
  dbg.next("memory", wants_to_enter, turn);

  await pause_stub();
  wants_to_enter[who] = TRUE;
  await pause_stub();
  while (TRUE === wants_to_enter[counterpart(who)]) {
    if (turn[0] !== who) {
      await pause_stub();
      wants_to_enter[who] = FALSE;
      await pause_stub();
      while (turn[0] !== who) {
        // busy waiting
        await pause_stub();
      }
      await pause_stub();
      wants_to_enter[who] = TRUE;
    }
    await pause_stub();
  }
  c.next(["pre", who]);
}

async function unlock(use_msgs, who, memory) {
  const [dbg, c, mPipe] = use_msgs();
  c.next(["post", who]);
  const { turn, wants_to_enter } = useMonitoredMemory(mPipe, memory);
  await pause_stub();
  wants_to_enter[who] = FALSE;
  await pause_stub();
  turn[0] = counterpart(who);
  dbg.next("unlock");
  await pause_stub();
}

expose(Demo(lock, unlock, Idle));
