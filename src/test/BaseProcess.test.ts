import { noop } from "lodash";
import { vi, it, describe, expect } from "vitest";
import { Demo } from "../use_case/BaseProcess";

describe("BaseProcess", () => {
  it("should emit pre and post event", () => {
    const d = Demo(noop, noop, noop);
    const coreMsg = d.core_msg();
    const handler = vi.fn();
    coreMsg.subscribe(handler);
    d.run(99).then(() => {
      expect(handler).toHaveBeenCalledTimes(2);
      expect(handler).toBeCalledWith(["pre", 99]);
      expect(handler).toBeCalledWith(["post", 99]);
    });
  });
});
