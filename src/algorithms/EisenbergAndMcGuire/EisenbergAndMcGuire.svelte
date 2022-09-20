<script>
  import BaseDemo from "../BaseDemo.svelte";

  const process_count = 13;
  const f = new Int32Array(new SharedArrayBuffer(4 * process_count));
  const t = new Int32Array(new SharedArrayBuffer(4));
</script>

<BaseDemo
  {process_count}
  memory={{
    flag: f,
    turn: t,
  }}
  url={new URL("./EisenbergAndMcGuire-tk2.ts", import.meta.url)}
  prefix="EisenbergAndMcGuire"
/>
