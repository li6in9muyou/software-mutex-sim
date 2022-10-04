import { noop } from "lodash";
import { vi, it, describe, expect } from "vitest";
import { break_point, Demo, pause_stub } from "../use_case/BaseProcess";

describe("BaseProcess", () => {
  it("should emit pre and post event", () => {
    const d = Demo(noop, noop, noop);
    const coreMsg = d.core_msg();
    const handler = vi.fn();
    coreMsg.subscribe(handler);
    d.run(99).then(() => {
      expect(handler).toBeCalledWith(["pre", 99]);
      expect(handler).toBeCalledWith(["post", 99]);
    });
  });

  it("should pause and resume", async () => {
    const d = Demo(
      async () => {
        await pause_stub();
      },
      noop,
      noop
    );
    const coreMsg = d.core_msg();
    const handler = vi.fn();
    coreMsg.subscribe(handler);

    d.request_pause();
    setTimeout(d.resume);
    await d.run(99);

    expect(handler).toBeCalledWith(["pre", 99]);
    expect(handler).toBeCalledWith(["post", 99]);
    expect(handler).toBeCalledWith({ type: "running", payload: 99 });
    expect(handler).toBeCalledWith({ type: "paused", payload: 99 });
  });

  it("should pause at every breakpoint", async () => {
    const d = Demo(
      async () => {
        await break_point(1, "first");
        await break_point(2, "second");
        await break_point(3, "third");
      },
      noop,
      noop
    );
    const coreMsg = d.core_msg();
    const handler = vi.fn();
    coreMsg.subscribe(handler);

    d.enable_breakpoints();
    setTimeout(d.resume);
    setTimeout(d.resume);
    setTimeout(d.resume);
    await d.run(99);

    const messages = ["crap", "first", "second", "third"];
    for (let i = 1; i < 1 + 3; i++) {
      expect(handler).toBeCalledWith({
        type: "lineno",
        payload: { pid: 99, message: messages[i], lineno: i },
      });
      expect(handler).toBeCalledWith({ type: "paused", payload: 99 });
    }
  });

  it("should default to not pausing at every breakpoint", async () => {
    const d = Demo(
      async () => {
        await break_point(1);
      },
      noop,
      noop
    );
    const handler = vi.fn();
    d.core_msg().subscribe(handler);

    await d.run(99);
  });

  it("should reset breakpoint settings after each run", async () => {
    const d = Demo(
      async () => {
        await break_point(1);
      },
      noop,
      noop
    );
    const handler = vi.fn();
    d.core_msg().subscribe(handler);

    d.enable_breakpoints();
    setTimeout(d.resume);
    await d.run(99);

    const d2 = Demo(
      async () => {
        await break_point(1);
      },
      noop,
      noop
    );
    await d2.run(99);
  });

  it("should signal completion", async () => {
    const d = Demo(noop, noop, noop);
    const handler = vi.fn();
    d.core_msg().subscribe(handler);

    await d.run(99);

    expect(handler).toBeCalledWith({ type: "completed", payload: 99 });
  });

  it("should not send messages to other process's subscriber", async () => {
    const one = Demo(noop, noop, noop);
    const two = Demo(noop, noop, noop);
    const one_handler = vi.fn();
    const two_handler = vi.fn();
    one.core_msg().subscribe(one_handler);
    two.core_msg().subscribe(two_handler);

    await one.run(99);
    await two.run(199);

    const expect_receive_own_messages = (pid, handler) => {
      expect(handler).toHaveBeenNthCalledWith(1, {
        type: "ready",
        payload: pid,
      });
      expect(handler).toHaveBeenLastCalledWith({
        type: "completed",
        payload: pid,
      });
    };
    expect_receive_own_messages(99, one_handler);
    expect_receive_own_messages(199, two_handler);

    const expect_not_receive_others = (another_pid, handler) => {
      expect(handler).not.toHaveBeenNthCalledWith(1, {
        type: "ready",
        payload: another_pid,
      });
      expect(handler).not.toHaveBeenLastCalledWith({
        type: "completed",
        payload: another_pid,
      });
    };

    expect_not_receive_others(199, one_handler);
    expect_not_receive_others(99, two_handler);
  });

  it("should not pause other processes", async () => {
    const one = Demo(
      async () => {
        await pause_stub();
      },
      noop,
      noop
    );
    const two = Demo(
      async () => {
        await pause_stub();
      },
      noop,
      noop
    );
    const one_handler = vi.fn();
    const two_handler = vi.fn();
    one.core_msg().subscribe(one_handler);
    two.core_msg().subscribe(two_handler);

    one.request_pause();
    setTimeout(one.resume);
    await Promise.all([one.run(99), two.run(199)]);

    expect(two_handler).not.toBeCalledWith({
      payload: 199,
      type: "paused",
    });
    expect(one_handler).not.toBeCalledWith({
      payload: 99,
      type: "paused",
    });
  });
});
