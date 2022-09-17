import { spawn, Thread } from "threads";
import debug from "debug";
const note = debug("StartManyProcesses");
const dbg = debug("DemoDebug");

export default class StartManyProcesses {
  private processes: any[];
  constructor(
    private readonly process_count: number,
    private readonly process_url: URL,
    private readonly core_msg_subscriber: (ev: any) => void,
    private readonly memory_msg_subscriber: (ev: any) => void,
    private readonly debug_msg_subscriber = (...args) => dbg(args)
  ) {
    Promise.all(
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
    ).then((processes) => (this.processes = processes));
  }

  async run(...args) {
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

  pause_by_pid(pid: number) {
    this.processes[pid].request_pause();
  }

  resume_by_pid(pid: number) {
    this.processes[pid].resume();
  }
}
