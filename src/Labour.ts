export interface IContext {
  [context_name: symbol]: SharedArrayBuffer;
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

  private context_handler = {
    set(target, property, value) {
      target[property] = value;
      console.log("set ", target, property, value);
      const message = { type: "sync_store", [property]: value };
      self.postMessage(message);
      return true;
    },
    get(target, property) {
      console.log("get ", target, property);
      return target[property];
    },
  };

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
    return new Proxy(this.prepare_context_impl(context), this.context_handler);
  }

  protected abstract lock_impl(context);
  protected abstract unlock_impl(context);
  protected abstract prepare_context_impl(context): IContext;
}
