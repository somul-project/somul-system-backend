import * as constants from "./common/constants";
import * as program from "commander";
import { Server } from "./server/server";
import { getDatabase } from "./database/database";


program.version(constants.VERSION);

program.command("serve").action(async () => {
    getDatabase().sync();
    const server = new Server();
    server.start();
});

program.parse(process.argv);
