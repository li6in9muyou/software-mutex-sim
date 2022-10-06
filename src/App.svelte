<script lang="ts">
  import InSimulation from "./view/InSimulation/InSimulation.svelte";
  import AlgorithmSelect from "./view/AlgorithmSelect.svelte";
  import { Lamport } from "./algorithms/Lamport/constants";
  import {
    CurrentSelectedAlgorithm,
    StaticDescription,
  } from "./view/algorithm_config";
  import { head } from "lodash";
  import AlgorithmConfig from "./view/AlgorithmConfig.svelte";
  import SlidingPages from "./view/SlidingPages.svelte";
  import SlidingPagesAdapter from "./view/adapter/SlidingPagesAdapter.js";
  import SimulationBuilder from "./use_case/SimulationBuilder";

  let sb, stores, per_process_state, memory_store, ProcessHandle, source_code;
  $: if ($CurrentSelectedAlgorithm) {
    sb = new SimulationBuilder($CurrentSelectedAlgorithm);
    stores = sb.get_stores();
    per_process_state = {
      process_count: $CurrentSelectedAlgorithm.process_count,
      ...stores,
    };
    memory_store = stores.memory_store;
    ProcessHandle = sb.get_process_handle();
    source_code = $CurrentSelectedAlgorithm.source_code;
  }
  const availableAlgorithms = [Lamport];
  StaticDescription.set(head(availableAlgorithms));
</script>

<div class="w-full overflow-x-hidden">
  <SlidingPages offset={$SlidingPagesAdapter}>
    <slot slot="left">
      <AlgorithmSelect options={availableAlgorithms} />
    </slot>
    <slot slot="middle">
      <AlgorithmConfig />
    </slot>
    <slot slot="right">
      <InSimulation
        {per_process_state}
        {memory_store}
        {ProcessHandle}
        {source_code}
      />
    </slot>
  </SlidingPages>
</div>
