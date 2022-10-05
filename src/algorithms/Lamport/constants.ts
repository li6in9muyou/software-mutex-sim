import type IStaticAlgorithmDescription from "../IStaticAlgorithmDescription";
import LamportDescriptionText from "./description.txt?raw";
export const TRUE = 99;
export const FALSE = -99;
export const Lamport: IStaticAlgorithmDescription = {
  name: "Lamport's Algorithm",
  description: LamportDescriptionText,
  memory_transform: (v: number) => {
    switch (v) {
      case TRUE: {
        return "TRUE";
      }
      case FALSE: {
        return "FALSE";
      }
      default:
        return v.toString();
    }
  },
};
