<script lang="ts">
  import InSimulation from "./view/InSimulation/InSimulation.svelte";
  import AlgorithmSelect from "./view/AlgorithmSelect.svelte";
  import { head } from "lodash";
  import AlgorithmConfig from "./view/AlgorithmConfig.svelte";
  import SlidingPages from "./view/SlidingPages.svelte";
  import SlidingPagesAdapter from "./view/adapter/SlidingPagesAdapter.js";
  import AlgorithmTable from "./algorithms/AlgorithmTable";
  import WebWorkerProcessGroup from "./use_case/WebWorkerProcessGroupAdapter";
  import type ISimulationConfig from "./use_case/ISimulationConfig";
  import { setContext } from "svelte";

  const availableAlgorithms = Array.from(AlgorithmTable.values());
  const selected = head(availableAlgorithms);
  let process_count = 4;
  let config: ISimulationConfig = {
    process_count,
    enable_breakpoint: false,
    max_process_count: selected.max_process_count,
  };

  $: setContext("source_code", selected.source_code);
  $: setContext("memory_transform", selected.memory_transform);
  $: getProcessGroup = () =>
    new WebWorkerProcessGroup(
      process_count,
      selected.algorithm_impl_url,
      selected.get_memory
    );
</script>

<div class="w-full overflow-x-hidden">
  <SlidingPages offset={$SlidingPagesAdapter}>
    <slot slot="left">
      <AlgorithmSelect options={availableAlgorithms} {selected} />
    </slot>
    <slot slot="middle">
      <AlgorithmConfig {config} />
    </slot>
    <slot slot="right">
      <InSimulation {getProcessGroup} />
    </slot>
  </SlidingPages>
</div>
