<script>
  import BaseDemo from "../BaseDemo.svelte";
  import { FALSE } from "./constants";

  const process_count = 2;
  const wants_to_enter = new Int32Array(
    new SharedArrayBuffer(4 * process_count)
  ).fill(FALSE);
</script>

<BaseDemo
  {process_count}
  memory={{
    wants_to_enter,
    turn: new Int32Array(new SharedArrayBuffer(4)),
  }}
  url={new URL("./Dekker-tk2.ts", import.meta.url)}
  prefix="Dekker"
/>
