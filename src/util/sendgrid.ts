import * as sgMail from '@sendgrid/mail';
import * as constants from '../common/constants';

sgMail.setApiKey(constants.SENDGRID_API_KEY);

export default function send(msg: any) {
  sgMail.send(msg);
}
