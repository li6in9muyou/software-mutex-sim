<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { SveltePort } from "../../SveltePort";
  import { Yield } from "../../utility";
  const process_count = 10;
  console.info("Lamport's begins");

  const flag_store = writable([]);
  const label_store = writable([]);
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
        const { flag, label } = d;
        let updated = false;
        if (flag !== undefined) {
          flag_store.set(Array.from(flag).map((v) => v === 99));
          updated = true;
        }
        if (label !== undefined) {
          label_store.set(label);
          updated = true;
        }
        if (!updated) {
          console.warn(`not updated: ${flag} ${label}`);
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
      const f = new SharedArrayBuffer(process_count);
      const l = new SharedArrayBuffer(process_count);
      killed_process_count = 0;
      for (let i = 0; i < process_count; i++) {
        const t = new Worker(new URL("./Lamport.ts", import.meta.url), {
          type: "module",
          name: `lamport's ${i}` /* @vite-ignore */,
        });
        t.onmessage = (d) => handleWorkerMessage(t, d);
        t.onerror = (ev) => console.error(`${i} error: ` + ev.data);
        workers[i] = t;
        t.postMessage({
          me: i,
          context: { flag: f, label: l },
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
  <h1>Lamport's Algorithm</h1>
  <h2>Global Memory</h2>
  <p>flag: {$flag_store}</p>
  <p>label: {$label_store}</p>
  <h2>overview</h2>
  <p>process_status: {$overview}</p>
  <p>those in critical region: {$in_region}</p>
  <p>those not in critical region: {$contending}</p>
</section>
