import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendBrandCredentials(email: string, password: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your Brand Account Credentials',
      text: `
Welcome!

Your login credentials:
Email: ${email}
Password: ${password}

Please login and change your password.
`,
    });
  }
}
