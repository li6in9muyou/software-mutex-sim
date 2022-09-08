<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { SveltePort } from "../../SveltePort";
  import { Yield } from "../../utility";
  import { range, shuffle } from "lodash";
  const process_count = 13;
  console.info("Lamport's begins");

  const flag_store = writable([]);
  const turn_store = writable([]);
  const port = new SveltePort(process_count);
  const in_region = port.those_in_critical_region;
  const contending = port.those_contending;
  const overview = port.process_status;
  let killed_process_count = 0;
  const workers = [];

  function handleWorkerMessage(worker, ev) {
    const d = ev.data;
    switch (d.type) {
      case "pre": {
        port.pre_critical_region(d.who);
        break;
      }
      case "post": {
        port.post_critical_region(d.who);
        break;
      }
      case "done": {
        workers[d.who].terminate();
        console.log(`${d.who} is killed`);
        killed_process_count += 1;
        break;
      }
      case "sync_store": {
        const { flag, turn } = d;
        let updated = false;
        if (flag !== undefined) {
          flag_store.set(
            Array.from(flag).map(
              (v) => ({ 99: "in-cs", 13: "idle", 42: "want-in" }[v])
            )
          );
          updated = true;
        }
        if (turn !== undefined) {
          turn_store.set(turn);
          updated = true;
        }
        if (!updated) {
          console.warn(`not updated: ${flag} ${turn}`);
        }
        break;
      }
      default: {
        console.info(d);
        break;
      }
    }
  }

  onMount(async () => {
    while (true) {
      const f = new SharedArrayBuffer(process_count);
      const t = new SharedArrayBuffer(1);
      killed_process_count = 0;

      for (const pid of shuffle(range(0, process_count))) {
        const w = new Worker(
          new URL("./EisenbergAndMcGuire.ts", import.meta.url),
          {
            type: "module",
            name: `lamport's ${pid}` /* @vite-ignore */,
          }
        );
        w.onmessage = (d) => handleWorkerMessage(w, d);
        w.onerror = (ev) => console.error(`${pid} error: ` + ev.data);
        workers[pid] = w;
        w.postMessage({
          me: pid,
          context: { flag: f, turn: t, process_count },
        });
      }
      console.log("done spawning");
      do {
        await Yield();
      } while (killed_process_count < process_count);
    }
  });
</script>

<section>
  <h1>Eisenberg/McGuire's Algorithm</h1>
  <h2>Global Memory</h2>
  <p>flag: {$flag_store}</p>
  <p>turn: {$turn_store}</p>
  <h2>overview</h2>
  <p>process_status: {$overview}</p>
  <p>those in critical region: {$in_region}</p>
  <p>those not in critical region: {$contending}</p>
</section>
