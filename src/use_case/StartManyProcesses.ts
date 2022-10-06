import { spawn, Thread } from "threads";
import debug from "debug";
const note = debug("StartManyProcesses");
const dbg = debug("DemoDebug");

export default class StartManyProcesses {
  private processes: any[];
  private readonly create_process_promise: Promise<any>;
  constructor(
    private readonly process_count: number,
    private readonly process_url: URL,
    private readonly core_msg_subscriber: (ev: any) => void,
    private readonly memory_msg_subscriber: (ev: any) => void,
    private readonly debug_msg_subscriber = (...args) => dbg(args)
  ) {
    this.create_process_promise = Promise.all(
      new Array(this.process_count).fill(null).map(async () => {
        const c = await spawn(
          new Worker(this.process_url, {
            type: "module",
          })
        );
        await c.memory_msg().subscribe(this.memory_msg_subscriber);
        await c.core_msg().subscribe(this.core_msg_subscriber);
        await c.debug_msg().subscribe(this.debug_msg_subscriber);
        return c;
      })
    );
    this.create_process_promise.then((processes) => {
      this.processes = processes;
      note("created processes");
    });
  }

  async run(...args) {
    await this.create_process_promise;
    note("after spawning, %o", this.processes);
    return await Promise.all(
      this.processes.map(async (cpu, pid) => {
        const ans = await cpu.run(pid, ...args);
        note("ans %o", ans);
        await Thread.terminate(cpu);
        note(`process ${pid} is killed`);
        return ans;
      })
    );
  }

  async run_by_pid(pid: number, ...args) {
    await this.create_process_promise;
    note("start pid %d", pid);
    const ans = await this.processes[pid].run(pid, ...args);
    note("ans %o", ans);
    await Thread.terminate(this.processes[pid]);
    note(`process ${pid} is killed`);
  }

  pause_all() {
    for (const process of this.processes) {
      process.request_pause();
    }
  }

  resume_all() {
    for (const process of this.processes) {
      process.resume();
    }
  }

  pause_by_pid(pid: number) {
    this.processes[pid].request_pause();
  }

  resume_by_pid(pid: number) {
    this.processes[pid].resume();
  }

  async kill_all() {
    await this.create_process_promise;
    return await Promise.all(
      this.processes.map(async (cpu, pid) => {
        await Thread.terminate(cpu);
        note(`process ${pid} is killed`);
      })
    );
  }
}
