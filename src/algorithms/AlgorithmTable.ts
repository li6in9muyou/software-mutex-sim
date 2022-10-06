import Lamport from "./Lamport/AlgorithmDescription";
import Peterson from "./Peterson/AlgorithmDescription";
import Dekker from "./Dekker/Dekker.desc";
import EisenbergAndMcGuire from "./EisenbergAndMcGuire/EisenbergAndMcGuire.desc";

export default new Map([
  ["Lamport's Algorithm", Lamport],
  ["Peterson's Algorithm", Peterson],
  ["Dekker's Algorithm", Dekker],
  ["Eisenberg/McGuire's Algorithm", EisenbergAndMcGuire],
]);
