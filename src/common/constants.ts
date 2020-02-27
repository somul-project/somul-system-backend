import * as dotenv from "dotenv";
import * as fs from "fs";


const envDev = dotenv.parse(fs.readFileSync(`./.env.development`));
export const VERSION  = envDev.VERSION;

export const SERVER_PORT = 80;
export const SECRET_CODE = "1s2o3m4u5l6";

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "651629416312-g6prv3b30pi2oga1v90hbnb290ebqeph.apps.googleusercontent.com";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "TMKJCilJiHURrWGQeghuxLzC";

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "f3c78768fbda3eb77d61";
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "fb3e0111a7d48cb0d6c4b8a46bcc712bd8041f0f";

export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "sss";

export const DB_ENDPOINT = process.env.DB_ENDPOINT || "localhost"
export const DB_NAME = process.env.DB_NAME || "somul"
export const DB_USERNAME = process.env.DB_USERNAME || "donghyeon"
export const DB_PASSWORD = process.env.DB_PASSWORD || "20163164"
