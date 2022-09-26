<script lang="ts">
  import InSimulation from "./InSimulation.svelte";
  import {
    onInSimulationPage,
    onAlgoSelectionPage,
    onAlgoConfigPage,
  } from "./model.js";
  import AlgorithmConfig from "./AlgorithmConfig.svelte";
  import AlgorithmSelect from "./AlgorithmSelect.svelte";
  import Frame from "./Frame.svelte";

  let offset: number;
  $: if ($onAlgoConfigPage) {
    offset = 1;
  } else if ($onAlgoSelectionPage) {
    offset = 0;
  } else {
    offset = 2;
  }
</script>

<div class="w-full overflow-x-hidden">
  <main
    class="flex w-[300vw] transition-transform duration-300"
    class:offset-0={offset === 0}
    class:offset-1={offset === 1}
    class:offset-2={offset === 2}
  >
    <Frame>
      {#if $onAlgoSelectionPage}
        <AlgorithmSelect />
      {/if}
    </Frame>

    <Frame>
      {#if $onAlgoConfigPage}
        <AlgorithmConfig />
      {/if}
    </Frame>

    <Frame>
      {#if $onInSimulationPage}
        <InSimulation />
      {/if}
    </Frame>
  </main>
</div>

<style>
  .offset-2 {
    transform: translateX(-66.666%);
  }
  .offset-1 {
    transform: translateX(-33.3333%);
  }
  .offset-0 {
    transform: translateX(0%);
  }
</style>
