<script lang="ts">
  import InSimulation from "./view/InSimulation/InSimulation.svelte";
  import AlgorithmSelect from "./view/AlgorithmSelect.svelte";
  import { StaticDescription } from "./view/algorithm_config";
  import { head } from "lodash";
  import AlgorithmConfig from "./view/AlgorithmConfig.svelte";
  import SlidingPages from "./view/SlidingPages.svelte";
  import SlidingPagesAdapter from "./view/adapter/SlidingPagesAdapter.js";
  import Lamport from "./algorithms/Lamport/AlgorithmDescription";

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
      <InSimulation />
    </slot>
  </SlidingPages>
</div>
