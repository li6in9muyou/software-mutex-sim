import { expose } from "threads";
import { noop } from "lodash";
import ImportBaseProcessModule from "../../use_case/BaseProcess";
const { Demo } = ImportBaseProcessModule();

expose(Demo(noop, noop, noop));
