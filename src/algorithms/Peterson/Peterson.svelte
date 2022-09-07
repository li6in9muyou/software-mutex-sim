<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  const process_count = 10;
  console.info("Peterson's begins");

  const victim_store = writable([]);
  const level_store = writable([]);
  function handleWorkerMessage(ev) {
    const d = ev.data;
    switch (d.type) {
      case "sync_store": {
        const { level, victim } = d;
        if (level !== undefined) {
          level_store.set(level);
        }
        if (victim !== undefined) {
          victim_store.set(victim);
        }
        break;
      }
      default: {
        console.info(d);
      }
    }
  }

  onMount(() => {
    const l = new SharedArrayBuffer(process_count);
    const v = new SharedArrayBuffer(process_count);
    for (let i = 0; i < process_count; i++) {
      const t = new Worker(new URL("./Peterson.ts", import.meta.url), {
        type: "module",
      });
      t.onmessage = handleWorkerMessage;
      t.onerror = (ev) => console.error(`${i} error: ` + ev.data);
      t.postMessage({
        me: i,
        level: l,
        victim: v,
      });
    }
    console.log("done spawning");
  });
</script>

<section>
  <h1>Peterson's Algorithm</h1>
  <h2>Global Memory</h2>
  <p>level: {$level_store}</p>
  <p>victim: {$victim_store}</p>
  <h2>overview</h2>
  <p>process_status:</p>
  <p>those in critical region:</p>
  <p>those not in critical region:</p>
</section>
