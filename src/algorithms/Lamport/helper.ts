import { expose } from "threads";
import { Lamport } from "./Lamport";
import { build_thread_pool_task } from "../../Labour";

expose(build_thread_pool_task(Lamport));
