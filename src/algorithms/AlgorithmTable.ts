import Lamport from "./Lamport/Lamport.desc";
import Peterson from "./Peterson/Peterson.desc";
import Dekker from "./Dekker/Dekker.desc";
import EisenbergAndMcGuire from "./EisenbergAndMcGuire/EisenbergAndMcGuire.desc";

export default new Map([
  ["Lamport's Algorithm", Lamport],
  ["Peterson's Algorithm", Peterson],
  ["Dekker's Algorithm", Dekker],
  ["Eisenberg/McGuire's Algorithm", EisenbergAndMcGuire],
]);
