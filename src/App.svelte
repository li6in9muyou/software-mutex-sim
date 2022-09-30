<script lang="ts">
  import InSimulation from "./view/InSimulation/Main.svelte";
  import { FALSE } from "./algorithms/Dekker/constants";
  import { createMemorySyncStoreAndSync } from "./use_case/MemoryWriteSync";
  import { get, readable } from "svelte/store";
  import ContendingOrNot from "./port/ContendingOrNot";
  import StartManyProcesses from "./use_case/StartManyProcesses";
  import { mockLineno } from "./view/InSimulation/utility";
  import debug from "debug";
  const d = debug(`App`);

  const process_count = 4;
  const algorithm_impl_url = new URL(
    "./algorithms/Lamport/Lamport-tk2.ts",
    import.meta.url
  );
  const prefix = "Lamport";
  const memory = {
    flag: new Int32Array(new SharedArrayBuffer(4 * process_count)).fill(FALSE),
    label: new Int32Array(new SharedArrayBuffer(4 * process_count)),
  };
  const [memory_store, m] = createMemorySyncStoreAndSync(memory);
  d("created stores %o", get(memory_store));

  const con = new ContendingOrNot(prefix, process_count);

  const dd = new StartManyProcesses(
    process_count,
    algorithm_impl_url,
    con.core_message_handler,
    m,
    con.debug_message_handler
  );
  function run() {
    dd.run(memory, process_count);
  }

  d("Start Many Processes %O", dd);

  const [is_in_region, ,] = con.get_stores_overview_contending_acquired();
  const per_process_state = {
    process_count,
    running: readable(new Array(process_count).fill(false)),
    in_critical_region_or_not: is_in_region,
    lineno: mockLineno(process_count),
  };
</script>

<InSimulation {per_process_state} {memory_store} use_case={{ run }} />
