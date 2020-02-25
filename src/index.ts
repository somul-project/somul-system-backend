import { Logger } from "./common/logger"
import * as constants from "./common/constants";
import * as program from "commander";

const log = Logger.createLogger("index");

program.version(constants.VERSION);

program.command("serve").action(async () => {
});

program.parse(process.argv);
