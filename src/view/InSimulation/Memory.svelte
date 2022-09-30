<script lang="ts">
  import { get } from "svelte/store";
  import type { MemorySliceStores } from "../../use_case/MemoryWriteSync";

  export let stores: MemorySliceStores = null;
</script>

<h2 class="mb-2 text-2xl underline">shard memory</h2>
{#each Object.keys($stores) as label}
  <div>
    <div class="mb-2 text-xl">{label}</div>
    <div class="mb-3 flex w-full gap-1">
      {#each get($stores[label]) as element}
        <div class="flex flex-1 justify-center border border-secondary text-xl">
          {element}
        </div>
      {/each}
    </div>
  </div>
{/each}
