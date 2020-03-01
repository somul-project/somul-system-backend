import * as constants from "./common/constants";
import * as program from "commander";
import { Server } from "./server/server";
import getDatabase from "./database";

program.version(constants.VERSION);

program.command("serve").action(async () => {
    getDatabase();
    const server = new Server();
    await server.start();
});

program.parse(process.argv);
