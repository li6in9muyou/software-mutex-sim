import { expect, it, describe } from "vitest";
import SimulationBuilder from "../use_case/SimulationBuilder";
import Process from "../use_case/ProcessFacade";
import Crap from "./resources/AlgorithmDescription";

describe("ProcessFacade", () => {
  let sb = new SimulationBuilder(Crap);

  it("should accept Simulation builder as input", () => {
    const process = Process.GetOne(sb);
    expect(process).toBeTruthy();
  });

  it("should have a process running state store", () => {
    const process = Process.GetOne(sb);
    expect(process.get_store("LifeCycle").subscribe).toBeTruthy();
    expect(process.get_store("Memory").subscribe).toBeTruthy();
    expect(process.get_store("LineNumber").subscribe).toBeTruthy();
  });

  it("should have process handle methods", () => {
    const process = Process.GetOne(sb);
    expect(process.pause).toBeTypeOf("function");
    expect(process.resume).toBeTypeOf("function");
    expect(process.start).toBeTypeOf("function");
    expect(process.kill).toBeTypeOf("function");
  });
});
