import { expose } from "threads";
import { PetersonSimpleBuilder } from "./Peterson";
import { build_thread_pool_task } from "../../Labour";

expose(build_thread_pool_task(new PetersonSimpleBuilder()));
