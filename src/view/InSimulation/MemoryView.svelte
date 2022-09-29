<script lang="ts">
  import { get } from "svelte/store";
  import type {
    IMemory,
    MemorySliceStores,
    MemorySliceTransformers,
  } from "../../use_case/MemoryWriteSync";
  import { make_identity_trans } from "../../use_case/MemoryWriteSync";

  export let memory: IMemory;
  export let stores: MemorySliceStores = null;
  export let transformers: MemorySliceTransformers = {};

  const trans = { ...make_identity_trans(get(stores)), ...transformers };
</script>

<h2 class="mb-2 text-2xl underline">shard memory</h2>
{#each Object.keys(memory) as label}
  <div>
    <div class="mb-2 text-xl">{label}</div>
    <div class="mb-3 flex w-full gap-1">
      {#each get($stores[label]).map((v) => trans[label](v)) as element}
        <div class="flex flex-1 justify-center border border-secondary text-xl">
          {element}
        </div>
      {/each}
    </div>
  </div>
{/each}
