<script lang="ts">
  import Frame from "./Frame.svelte";

  export let offset: number;
</script>

<main
  class="flex w-[300vw] transition-transform duration-200"
  class:offset-0={offset === 0}
  class:offset-1={offset === 1}
  class:offset-2={offset === 2}
>
  <Frame>
    <slot name="left">left</slot>
  </Frame>

  <Frame>
    <slot name="middle">middle</slot>
  </Frame>

  <Frame>
    <slot name="right">right</slot>
  </Frame>
</main>

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
