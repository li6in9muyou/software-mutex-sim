<script lang="ts">
  import InSimulation from "./InSimulation.svelte";
  import {
    onInSimulationPage,
    onAlgoSelectionPage,
    onAlgoConfigPage,
  } from "./model.js";
  import AlgorithmConfig from "./AlgorithmConfig.svelte";
  import AlgorithmSelect from "./AlgorithmSelect.svelte";
</script>

<main class="p-2">
  {#if $onInSimulationPage}
    <InSimulation />
  {/if}
  {#if $onAlgoSelectionPage}
    <AlgorithmSelect />
  {/if}
  {#if $onAlgoConfigPage}
    <AlgorithmConfig />
  {/if}
</main>
