import * as dotenv from "dotenv";
import * as fs from "fs";

export const PORT = 80;

const envDev = dotenv.parse(fs.readFileSync(`./.env.development`));
export const VERSION  = envDev.VERSION;
