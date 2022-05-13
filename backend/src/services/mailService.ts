import nodemailer from 'nodemailer';
import { BackendError } from '../../../shared/BackendError';
import { ErrorCodes } from '../../../shared/enums';
import logger from '../config/logger';

async function sendEmail(message: string, isUpdate?: boolean): Promise<void> {
  // TODO: Update values to production-ready values when available.
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'dereck.schultz70@ethereal.email',
      pass: 'Qdxw9GdezmasgUVDEU',
    },
  });

  try {
    // TODO: Updated values to production-ready values when available.
    const info = await transporter.sendMail({
      from: 'Tester <test@test.com>',
      to: 'anyone@test.com',
      subject: isUpdate
        ? 'En beställning har uppdaterats!'
        : 'En ny beställning har lagts!',
      text: message,
    });

    if (process.env.NODE_ENV === 'dev') {
      // eslint-disable-next-line no-console
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (error) {
    logger.error(error, "Email notification wasn't sent!");
    throw new BackendError(500, ErrorCodes.MAIL_ERROR, 'Email failed to send');
  }
}

export { sendEmail };
