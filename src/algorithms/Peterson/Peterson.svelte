<script>
  import { onMount } from "svelte";
  const process_count = 10;
  console.info("Peterson's begins");

  onMount(() => {
    const l = new SharedArrayBuffer(process_count);
    const v = new SharedArrayBuffer(process_count);
    for (let i = 0; i < process_count; i++) {
      const t = new Worker(new URL("./Peterson.ts", import.meta.url), {
        type: "module",
      });
      t.onmessage = (ev) => console.info(`${i} said: ` + ev.data);
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
  <p>level:</p>
  <p>victim:</p>
  <h2>overview</h2>
  <p>process_status:</p>
  <p>those in critical region:</p>
  <p>those not in critical region:</p>
</section>
