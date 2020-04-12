
import { IncomingWebhook } from '@slack/webhook';
import * as constants from '../common/constants';
import Logger from '../common/logger';

const log = Logger.createLogger('util.slack');

const webhook = new IncomingWebhook(constants.SLACK_WEBHOOK_URL);

type levelType = 'error' | 'info' | 'debug';

export default class Slack {
  static level_info = {
    error: {
      color: 'CC0000',
      text: 'Error log',
    },
    info: {
      color: '66FF33',
      text: 'Info log',
    },
    debug: {
      color: '66FF33',
      text: 'Debug log',
    },

  }

  static async send(level: levelType, value: string) {
    try {
      await webhook.send({
        text: Slack.level_info[level].text,
        attachments: [
          {
            color: Slack.level_info[level].color,
            fields: [
              {
                title: '알림',
                value,
                short: false,
              },
            ],
          },
        ],
      });
    } catch (error) {
      log.error(`[-] failed to send - ${error}`);
    }
  }
}
