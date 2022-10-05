import { writable } from "svelte/store";
import type IStaticAlgorithmDescription from "../algorithms/IStaticAlgorithmDescription";

export const CurrentSelectedAlgorithm = writable<IStaticAlgorithmDescription>();

export const ProcessCount = writable<number>(2);
