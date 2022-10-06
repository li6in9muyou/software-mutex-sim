<script lang="ts">
  export let id: number;
  export let offset: number;
</script>

<section class="w-screen p-2">
  {#if id === offset}
    <slot />
  {/if}
</section>
