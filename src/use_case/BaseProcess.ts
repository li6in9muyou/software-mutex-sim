import { isUndefined } from "lodash";
import { Observable, Subject } from "threads/observable";
import { merge } from "observable-fns";
import {
  Completed,
  LineNumber,
  Paused,
  Post,
  Pre,
  Ready,
  Running,
} from "./ReportingEvents";

export default () => {
  let shouldPause = false;
  let _pauseAtEveryBreakpoint = false;
  let _resolve: (value: null) => void;
  let _pause: Promise<null>;
  let _i = 0;
  const _mem_msg = new Subject();
  const _core_msg = new Subject();
  const _running_sync_msg = new Subject();
  const _debug_msg = new Subject();
  const dbg = (args) => _debug_msg.next(args);

  function pause() {
    shouldPause = true;
    _pause = new Promise((resolve) => {
      _resolve = () => {
        shouldPause = false;
        return resolve(null);
      };
    });
  }

  function use_message_bus() {
    return [_debug_msg, _core_msg, _mem_msg];
  }

  function lock_critical_region_unlock_cycle(
    lock_impl,
    unlock_impl,
    critical_region
  ) {
    _running_sync_msg.next(Ready());
    return async (useMessageBus, pid: number, ...args: any[]) => {
      _running_sync_msg.next(Running());
      await lock_impl(useMessageBus, pid, ...args);
      _core_msg.next(Pre());
      await critical_region();
      _core_msg.next(Post());
      await unlock_impl(useMessageBus, pid, ...args);
      _core_msg.next(Completed());
    };
  }

  async function pause_stub() {
    if (shouldPause) {
      dbg(`${_i} is paused`);
      _running_sync_msg.next(Paused());
      await _pause;
    }
    _running_sync_msg.next(Running());
    return null;
  }

  async function break_point(lineno: number, message?: string) {
    _running_sync_msg.next(LineNumber(lineno));
    if (_pauseAtEveryBreakpoint) {
      pause();
    }
    await pause_stub();
  }

  function disable_breakpoints() {
    _pauseAtEveryBreakpoint = false;
  }

  const Demo = (lock_impl, unlock_impl, critical_region) => ({
    memory_msg() {
      return Observable.from(_mem_msg);
    },
    core_msg() {
      return merge(
        Observable.from(_core_msg),
        Observable.from(_running_sync_msg)
      );
    },
    debug_msg() {
      return Observable.from(_debug_msg);
    },
    resume() {
      if (shouldPause && !isUndefined(_resolve)) {
        dbg(`resume ${_i}`);
        return _resolve(null);
      }
      dbg(`this cpu is not paused`);
    },
    request_pause() {
      if (!shouldPause) {
        dbg("request_pause");
        pause();
      } else {
        dbg("already paused");
      }
    },
    enable_breakpoints() {
      _pauseAtEveryBreakpoint = true;
    },
    disable_breakpoints,
    async run(pid: number, ...args: any[]) {
      dbg(`${pid} starts running with args ${JSON.stringify(args)}`);
      _i = pid;

      const ans = await lock_critical_region_unlock_cycle(
        lock_impl,
        unlock_impl,
        critical_region
      )(use_message_bus, pid, ...args);

      dbg(`${pid} completed`);
      disable_breakpoints();
      return [ans, pid];
    },
  });

  return { Demo, pause_stub, break_point };
};
