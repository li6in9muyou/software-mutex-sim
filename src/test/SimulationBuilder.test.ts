import { describe, it, expect } from "vitest";
import type IStaticAlgorithmDescription from "../algorithms/IStaticAlgorithmDescription";
import { identity } from "lodash";
import SimulationBuilder from "../use_case/SimulationBuilder";

function expect_sync_stores_has_subscribe_method(
  sb: SimulationBuilder,
  label: string
) {
  expect(sb).toBeTruthy();
  const stores = sb.getSync(label).get_stores();
  expect(stores.length).toBeGreaterThan(0);
  for (const store of stores) {
    expect(store.subscribe).toBeTypeOf("function");
  }
}

describe("SimulationBuilder", () => {
  it("should build various Syncs", () => {
    const algo: IStaticAlgorithmDescription = {
      name: "crap",
      memory_transform: identity,
    };
    const sb = new SimulationBuilder(algo);
    expect_sync_stores_has_subscribe_method(sb, "LifeCycle");
    expect_sync_stores_has_subscribe_method(sb, "LineNumber");
    expect_sync_stores_has_subscribe_method(sb, "CriticalRegion");
    expect_sync_stores_has_subscribe_method(sb, "Memory");
  });
});
