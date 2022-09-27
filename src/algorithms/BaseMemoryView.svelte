<script lang="ts">
  import { get } from "svelte/store";
  import type {
    IMemory,
    MemorySliceStores,
    MemorySliceTransformers,
  } from "../use_case/MemoryWriteSync";
  import { make_identity_trans } from "../use_case/MemoryWriteSync";

  export let memory: IMemory;
  export let stores: MemorySliceStores = null;
  export let transformers: MemorySliceTransformers = make_identity_trans(
    get(stores)
  );
</script>

<h2>Global Memory</h2>
{#each Object.keys(memory) as label}
  <p>{label}: {get($stores[label]).map((v) => transformers[label](v))}</p>
{/each}
