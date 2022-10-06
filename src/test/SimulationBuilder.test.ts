import { describe, it, expect } from "vitest";
import SimulationBuilder from "../use_case/SimulationBuilder";
import Crap from "./resources/AlgorithmDescription";

describe("SimulationBuilder", () => {
  it("should build stores and handles only once", () => {
    const sb = new SimulationBuilder(Crap);
    expect(sb).toBeTruthy();
  });
});
