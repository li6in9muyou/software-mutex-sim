import { get, type Readable, type Writable, writable } from "svelte/store";
import { identity, isArray, isFunction, isUndefined } from "lodash-es";
import debug from "debug";
import type { Subject } from "threads/observable";

export type IMemory = { [key: string]: Int32Array };

export type MemorySyncMessage = [string, Array<number>];

export function useMonitoredMemory(
  sync: Subject<MemorySyncMessage>,
  mem: IMemory
) {
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
    sync.next([slice, Array.from(mem[slice])]);
  }
  return monitored;
}

export function createMemorySyncStoreAndSync(
  memory: IMemory
): [
  Writable<{ [key: string]: Writable<Array<number>> }>,
  (msg: MemorySyncMessage) => void
] {
  const d = debug("memory sync handler");
  const stores = writable<{ [key: string]: Writable<Array<number>> }>({});
  for (const memoryKey in memory) {
    stores.update((prev) => ({
      ...prev,
      [memoryKey]: writable(Array.from(memory[memoryKey])),
    }));
  }

  function handler(msg: MemorySyncMessage) {
    if (isArray(msg) && msg.length === 2) {
      const [which, array] = msg;
      const s = get(stores);

      d("attempting to update store %s %o", which, array);
      if (!isUndefined(s[which])) {
        s[which].set(array);
        stores.set(s);
        d("success");
      } else {
        d("segment fault %s", which);
      }
    }
  }

  return [stores, handler];
}

export function make_identity_trans(s) {
  const ans = {};
  for (const sKey in s) {
    ans[sKey] = identity;
  }
  return ans;
}

export type MemorySliceStores = Readable<{
  [key: string]: Readable<Array<number>>;
}>;

export type MemorySliceTransformers = { [key: string]: (number) => string };
