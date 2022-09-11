import { isFunction } from "lodash";

export interface IContext {
  [context_name: symbol]: SharedArrayBuffer;
}

export interface IWhoContextCtor {
  simpleBuild(pid: number, context: any): Labour;
}

export default abstract class Labour {
  who: number;
  context: IContext;
  private readonly useful_function: () => void;

  protected constructor(who: number, context: IContext, useful_function) {
    this.who = who;
    this.useful_function = useful_function;
    this.context = context;
  }

  terminate() {
    self.postMessage({ type: "done" });
    self.close();
  }

  private get_hook_for(context_key) {
    const cook = (raw) =>
      this.prepare_context_impl({ [context_key]: raw })[context_key];
    return {
      set(buffer, index, value) {
        const cooked = cook(buffer);
        cooked[index] = value;
        self.postMessage({
          type: "sync_store",
          [context_key]: cooked,
        });
        return true;
      },
      get(buffer, index) {
        const cooked = cook(buffer);
        const meat = cooked[index];
        if (isFunction(meat)) {
          return meat.bind(cooked);
        } else {
          return meat;
        }
      },
    };
  }

  async run() {
    await this.lock();
    await this.useful_function();
    await this.unlock();
    self.postMessage({ type: "done", who: this.who });
  }

  async lock() {
    const cooked = this.prepare_context(this.context);
    this.lock_impl(cooked);
    self.postMessage({ type: "pre", who: this.who });
  }

  async unlock() {
    self.postMessage({ type: "post", who: this.who });
    this.unlock_impl(this.prepare_context(this.context));
  }

  prepare_context(context) {
    const with_trap = {};
    for (const contextKey in this.prepare_context_impl(context)) {
      with_trap[contextKey] = new Proxy(
        context[contextKey],
        this.get_hook_for(contextKey)
      );
    }
    return with_trap;
  }

  protected abstract lock_impl(context);
  protected abstract unlock_impl(context);
  protected abstract prepare_context_impl(context): IContext;
}

export function build_thread_pool_task(klass: IWhoContextCtor) {
  return async (data) => {
    const { me, context } = data;
    await klass.simpleBuild(me, context).run();
  };
}
