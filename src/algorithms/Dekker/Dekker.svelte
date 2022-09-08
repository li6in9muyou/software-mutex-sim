<script>
  import { SveltePort } from "../../SveltePort";
  import { onMount } from "svelte";
  import { Yield } from "../../utility";
  import { writable } from "svelte/store";

  const wants_to_enter_store = writable([false, false]);
  const turn_store = writable([0]);
  const port = new SveltePort(2);
  const those_in_critical_region = port.those_in_critical_region;
  const those_contending = port.those_contending;
  const process_status = port.process_status;

  const workers = [];
  let killed_process_count = 0;
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
        const { wants_to_enter, turn } = d;
        if (wants_to_enter !== undefined) {
          wants_to_enter_store.set(
            Array.from(wants_to_enter).map((i) => i === 99)
          );
        }
        if (turn !== undefined) {
          turn_store.set(turn);
        }
        break;
      }
      default: {
        console.info(d);
      }
    }
  }

  onMount(async () => {
    while (true) {
      console.info("Dekker's begins");
      const wte = new SharedArrayBuffer(2);
      const t = new SharedArrayBuffer(1);
      killed_process_count = 0;
      for (let i = 0; i < 2; i++) {
        const w = new Worker(new URL("./Dekker.ts", import.meta.url), {
          type: "module",
          name: `dekker's no.${i}` /* @vite-ignore */,
        });
        w.onmessage = (d) => handleWorkerMessage(w, d);
        w.onerror = (ev) => console.error(`${i} error: ` + ev.data);
        workers[i] = w;
        w.postMessage({
          me: i,
          context: { turn: t, wants_to_enter: wte },
        });
      }
      do {
        await Yield();
      } while (killed_process_count < 2);
      console.info("Dekker's finishes");
    }
  });
</script>

<section>
  <h1>Dekker's/Peterson's Algorithm</h1>
  <h2>Global Memory</h2>
  <p>wants_to_enter:{$wants_to_enter_store}</p>
  <p>turn:{$turn_store}</p>
  <h2>overview</h2>
  <p>process_status:{$process_status}</p>
  <p>those in critical region:{$those_in_critical_region}</p>
  <p>those not in critical region:{$those_contending}</p>
</section>
