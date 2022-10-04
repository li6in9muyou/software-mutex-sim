import type IProcessHandle from "../../use_case/ProcessHandle";
import type { ISingleProcessHandle } from "../../use_case/ProcessHandle";

export default function (
  pid: number,
  process_handle: IProcessHandle
): ISingleProcessHandle {
  return {
    run: () => process_handle.runOne(pid),
    resume: () => process_handle.resume(pid),
    pause: () => process_handle.pause(pid),
  };
}
