import { expose } from "threads";
import { Peterson } from "./Peterson";
import { build_thread_pool_task } from "../../Labour";

expose(build_thread_pool_task(Peterson));
