<script>
  import Dekker from "./algorithms/Dekker/Dekker.svelte";
  import Peterson from "./algorithms/Peterson/Peterson.svelte";
  import Lamport from "./algorithms/Lamport/Lamport.svelte";
  import EisenbergAndMcGuire from "./algorithms/EisenbergAndMcGuire/EisenbergAndMcGuire.svelte";
</script>

<main>
  <div class="algoContainer"><Dekker /></div>
  <div class="algoContainer"><Peterson /></div>
  <div class="algoContainer"><Lamport /></div>
  <div class="algoContainer"><EisenbergAndMcGuire /></div>
</main>

<style>
  * {
    background-color: black;
    color: silver;
  }
  main {
    padding: 0.2rem 0.3rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .algoContainer {
    border: solid 2px midnightblue;
    padding: 1rem;
    margin: 0.2rem;
  }
</style>
