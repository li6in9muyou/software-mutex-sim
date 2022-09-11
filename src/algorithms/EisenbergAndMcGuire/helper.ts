import { expose } from "threads";
import { EisenbergAndMcGuireSimpleBuilder } from "./EisenbergAndMcGuire";
import { build_thread_pool_task } from "../../Labour";

expose(build_thread_pool_task(new EisenbergAndMcGuireSimpleBuilder()));
