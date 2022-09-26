<script>
  import BaseDemo from "../BaseDemo.svelte";

  const process_count = 10;
</script>

<BaseDemo
  {process_count}
  memory={{
    level: new Int32Array(new SharedArrayBuffer(4 * process_count)),
    victim: new Int32Array(new SharedArrayBuffer(4 * process_count)),
  }}
  algorithm_impl_url={new URL("./Peterson-tk2.ts", import.meta.url)}
  prefix="Peterson"
/>
