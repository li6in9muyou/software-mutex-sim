<script lang="ts">
  import { type Readable } from "svelte/store";
  import { isEmpty, isNull } from "lodash-es";
  import { getContext } from "svelte";

  export let lineno: Readable<number> = null;
  const source_code = getContext<Readable<[number, string][]>>("source_code");
  if (isNull(source_code) || isEmpty(source_code)) {
    throw new Error("empty source code");
  }
  const line_style = "min-h-6 font-mono h-fit whitespace-nowrap whitespace-pre";
</script>

<ol
  class="flex flex-col overflow-y-auto rounded bg-base-300 py-4 text-primary-content"
>
  {#each $source_code as line}
    {#if line[0] === $lineno}
      <li class="indicator ml-4">
        <span
          class="badge indicator-item badge-secondary badge-sm indicator-start indicator-middle"
        />
        <div class="px-4">
          <div class={line_style}>
            {line[1]}
          </div>
        </div>
      </li>
    {:else}
      <div class="ml-4 px-3 transition-all duration-300">
        <div class={line_style}>
          {line[1]}
        </div>
      </div>
    {/if}
  {/each}
</ol>
