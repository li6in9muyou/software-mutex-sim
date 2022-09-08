export interface IContext {
  [context_name: string]: SharedArrayBuffer;
}

export default abstract class Labour {
  who: number;
  context: IContext;
  private readonly useful_function: () => void;

  constructor(who: number, context: IContext, useful_function) {
    this.who = who;
    this.useful_function = useful_function;
    this.context = new Proxy(context, this.context_handler);
    self.onmessage = (ev) => {
      this.run().then(this.terminate);
    };
  }

  private terminate() {
    self.postMessage({ action: "done" });
    self.close();
  }

  private context_handler = {
    set(target, property, value) {
      target[property] = value;
      self.postMessage({ type: "sync_store", context: this.context });
      return true;
    },
    get(target, property) {
      return target[property];
    },
  };

  private async run() {
    await this.lock();
    await this.useful_function();
    await this.unlock();
  }

  async lock() {
    const cooked = this.prepare_context(this.context);
    this.lock_impl(cooked);
  }

  async unlock() {
    const cooked = this.prepare_context(this.context);
    this.unlock_impl(cooked);
  }

  protected abstract lock_impl(context);
  protected abstract unlock_impl(context);
  protected abstract prepare_context(context): IContext;
}
