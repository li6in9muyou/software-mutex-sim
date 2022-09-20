import { isFunction, isUndefined } from "lodash";
import { Observable, Subject } from "threads/observable";

let shouldPause = false;
let _resolve: (value: null) => void;
let _pause: Promise<null>;
let _i = 0;
const _mem_msg = new Subject();
const _core_msg = new Subject();
const _debug_msg = new Subject();
const dbg = (...args) => _debug_msg.next(args);

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

export async function pause_stub() {
  if (shouldPause) {
    dbg(`${_i} is paused`);
    await _pause;
    return null;
  }
  return null;
}

export type IMemory = { [key: string]: Int32Array };

export function useMonitoredMemory(sync: Subject<any>, mem: IMemory) {
  function build_proxy_handler_for_key(slice: string) {
    return {
      set(buffer: Int32Array, index: string, value: number) {
        buffer[Number(index)] = value;
        sync.next([slice, Array.from(buffer)]);
        return true;
      },
      get(buffer: Int32Array, index: number) {
        const element = buffer[index];
        if (isFunction(element)) {
          return element.bind(buffer);
        } else {
          return element;
        }
      },
    };
  }
  const monitored = {} as IMemory;
  for (const slice in mem) {
    monitored[slice] = new Proxy(
      mem[slice],
      // @ts-ignore
      build_proxy_handler_for_key(slice)
    );
  }
  return monitored;
}

function lock_critical_region_unlock_cycle(
  lock_impl,
  unlock_impl,
  critical_region
) {
  return async (useMessageBus, pid: number, ...args: any[]) => {
    await lock_impl(useMessageBus, pid, ...args);
    await critical_region();
    await unlock_impl(useMessageBus, pid, ...args);
  };
}

export const Demo = (lock_impl, unlock_impl, critical_region) => ({
  memory_msg() {
    return Observable.from(_mem_msg);
  },
  core_msg() {
    return Observable.from(_core_msg);
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
  async run(pid: number, ...args: any[]) {
    dbg(`${pid} starts running with args ${args}`);
    _i = pid;

    const ans = await lock_critical_region_unlock_cycle(
      lock_impl,
      unlock_impl,
      critical_region
    )(use_message_bus, pid, ...args);

    dbg(`${pid} completed`);
    return [ans, pid];
  },
});
