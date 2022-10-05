<script lang="ts">
  import InSimulation from "./view/InSimulation/Main.svelte";
  import { FALSE } from "./algorithms/Dekker/constants";
  import { createMemorySyncStoreAndSync } from "./use_case/MemoryWriteSync";
  import { get } from "svelte/store";
  import ContendingOrNot from "./port/ContendingOrNot";
  import SingleObservableAdapter from "./use_case/SingleObservableAdapter";
  import debug from "debug";
  import RunningSync from "./use_case/RunningSync";
  import { SveltePort } from "./SveltePort";
  import type IProcessHandle from "./use_case/ProcessHandle";
  import SlidingPages from "./view/SlidingPages.svelte";
  import AlgorithmSelect from "./view/AlgorithmSelect.svelte";
  import { Lamport } from "./algorithms/Lamport/constants";
  import { CurrentSelectedAlgorithm } from "./view/algorithm_config";
  import { head, identity } from "lodash";
  import type IStaticAlgorithmDescription from "./algorithms/IStaticAlgorithmDescription";
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

  const port = new SveltePort(process_count);
  const con = new ContendingOrNot(prefix, port);
  const soa = new SingleObservableAdapter(process_count, algorithm_impl_url);
  soa.messages.subscribe(con.core_message_handler);
  soa.messages.subscribe(con.debug_message_handler);
  soa.messages.subscribe(m);

  const runningSync = new RunningSync(process_count, soa.messages);

  const ProcessHandle: IProcessHandle = {
    runAll: () => soa.processes_handle.run(memory, process_count),
    runOne: (pid: number) =>
      soa.processes_handle.run_by_pid(pid, memory, process_count),
    resume: (pid: number) => soa.processes_handle.resume_by_pid(pid),
    resumeAll: () => soa.processes_handle.resume_all(),
    pause: (pid: number) => soa.processes_handle.pause_by_pid(pid),
    pauseAll: () => soa.processes_handle.pause_all(),
  };

  const [is_in_region, ,] = con.get_stores_overview_contending_acquired();
  const per_process_state = {
    process_count,
    running: runningSync.running,
    in_critical_region_or_not: is_in_region,
    lineno: runningSync.lineno,
  };

  const availableAlgorithms = [
    { name: "crap senior", memory_transform: identity },
    { name: "crap junior", memory_transform: identity },
    Lamport,
  ];
  let selectedAlgorithm = null; //head(availableAlgorithms);
  $: CurrentSelectedAlgorithm.set(selectedAlgorithm);
</script>

<div class="w-full overflow-x-hidden">
  <SlidingPages offset={$SlidingPagesAdapter}>
    <slot slot="left">
      <AlgorithmSelect />
    </slot>
    <slot slot="middle">
      <AlgorithmConfig />
    </slot>
    <slot slot="right">
      <InSimulation {per_process_state} {memory_store} {ProcessHandle} />
    </slot>
  </SlidingPages>
</div>
