import { MailSlurp } from 'mailslurp-client';

export class EmailUtil {
  private mailSurp: MailSlurp;

  constructor() { 
    this.mailSurp = new MailSlurp({ apiKey: process.env.MAIL_SLURP_API_KEY! });
  }

  public async createInbox() {
    const inbox = await this.mailSurp.inboxController.createInboxWithDefaults();
    return inbox;
  }

  public async waitForLatestEmail(inboxId: string) {
    const email = await this.mailSurp.waitForLatestEmail(inboxId, 30000);
    return email;
  }
}



