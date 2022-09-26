<script>
  import BaseDemo from "../BaseDemo.svelte";
  import { FALSE } from "./constants";

  const process_count = 10;
  const flag = new Int32Array(new SharedArrayBuffer(4 * process_count));
  flag.fill(FALSE);
</script>

<BaseDemo
  {process_count}
  memory={{
    flag,
    label: new Int32Array(new SharedArrayBuffer(4 * process_count)),
  }}
  algorithm_impl_url={new URL("./Lamport-tk2.ts", import.meta.url)}
  prefix="Lamport"
/>
