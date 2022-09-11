import { expose } from "threads";
import { Dekker } from "./Dekker";
import { build_thread_pool_task } from "../../Labour";

expose(build_thread_pool_task(Dekker));
