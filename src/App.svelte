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
  import ProcessGroup from "./use_case/ProcessGroupFacade";

  let sb, ProcessHandle;
  $: if ($CurrentSelectedAlgorithm) {
    sb = new SimulationBuilder($CurrentSelectedAlgorithm);
    ProcessHandle = ProcessGroup.GetMany(sb);
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
      <InSimulation {ProcessHandle} />
    </slot>
  </SlidingPages>
</div>
