import * as sgMail from "@sendgrid/mail";
import * as constants from "./constants";

sgMail.setApiKey(constants.SENDGRID_API_KEY);

export function send(msg: any) {
  sgMail.send(msg);
}