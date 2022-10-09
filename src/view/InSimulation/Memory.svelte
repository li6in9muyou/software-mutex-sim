<script lang="ts">
  import { derived, type Readable } from "svelte/store";
  import { getContext } from "svelte";

  export let stores: Map<string, Readable<Array<number>>> = null;
  const memory_transform =
    getContext<Readable<(number) => string>>("memory_transform");

  const memKeys = [...stores!.keys()];
  const memValues = memKeys.map((k) => stores.get(k));
  const memory = derived(memValues, (ss, set) => {
    const ans = {};
    for (let i = 0; i < memValues.length; i++) {
      ans[memKeys[i]] = ss[i];
    }
    set(ans);
  });
</script>

<h2 class="mb-2 text-2xl underline">shared memory</h2>
<section class="flex flex-grow flex-wrap gap-3">
  {#each memKeys as label}
    <div class="inline">
      <div class="mb-2 text-xl">{label}</div>
      <div class="mb-3 flex w-full flex-wrap gap-2">
        {#each $memory[label] as element}
          <div
            class="flex w-fit justify-center border border-secondary px-1 text-xl"
          >
            {$memory_transform(element)}
          </div>
        {/each}
      </div>
    </div>
  {/each}
</section>
