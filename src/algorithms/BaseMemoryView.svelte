<script lang="ts">
  import { get } from "svelte/store";
  import type { Readable } from "svelte/store";
  import type { IMemory } from "../use_case/MemoryWriteSync";

  export let memory: IMemory;
  export let stores: Readable<Readable<Array<number>>>;
</script>

<h2>Global Memory</h2>
{#each Object.keys(memory) as label}
  <p>{label}: {get($stores[label])}</p>
{/each}
