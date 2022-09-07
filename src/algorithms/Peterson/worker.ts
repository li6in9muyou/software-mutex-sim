import { Idle } from "../../utility";
import { lock, unlock } from "./Peterson";

self.onmessage = async (ev) => {
  await lock(ev.data);
  await Idle();
  await unlock(ev.data);
  self.postMessage(`${ev.data} done`);
};
