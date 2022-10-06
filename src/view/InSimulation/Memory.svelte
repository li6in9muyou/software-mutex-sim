<script lang="ts">
  import { get } from "svelte/store";
  import type { MemorySliceStores } from "../../use_case/MemoryWriteSync";
  import { CurrentSelectedAlgorithm } from "../algorithm_config";

  export let stores: MemorySliceStores = null;
</script>

<h2 class="mb-2 text-2xl underline">shared memory</h2>
<section class="flex flex-grow flex-wrap gap-3">
  {#each Object.keys($stores) as label}
    <div class="inline">
      <div class="mb-2 text-xl">{label}</div>
      <div class="mb-3 flex w-full flex-wrap gap-2">
        {#each get($stores[label]) as element}
          <div
            class="flex w-fit justify-center border border-secondary px-1 text-xl"
          >
            {$CurrentSelectedAlgorithm.memory_transform(element)}
          </div>
        {/each}
      </div>
    </div>
  {/each}
</section>
