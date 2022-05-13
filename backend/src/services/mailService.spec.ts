/* eslint-disable @typescript-eslint/no-explicit-any */

import { sendEmail } from './mailService';
import nodemailer from 'nodemailer';
import { BackendError } from '../../../shared/BackendError';
import logger from '../config/logger';

jest.mock('nodemailer');
jest.mock('../config/logger');

const mockedNodemailer = jest.mocked(nodemailer, true);
const mockedLogger = jest.mocked(logger, true);

describe('sendEmail', () => {
  const createTransport = mockedNodemailer.createTransport as jest.MockInstance<
    unknown,
    any
  >;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns a backend error if an email couldn't be sent", async () => {
    createTransport.mockReturnValueOnce({
      sendMail: jest.fn().mockRejectedValueOnce(null),
    });

    expect.assertions(1);
    try {
      await sendEmail('');
    } catch (err: unknown) {
      const error = err as BackendError;
      expect(error.HTTPStatus).toBeTruthy();
    }
  });

  it('logs an error message on error', async () => {
    createTransport.mockReturnValueOnce({
      sendMail: jest.fn().mockRejectedValueOnce(null),
    });

    expect.assertions(1);
    try {
      await sendEmail('');
    } catch (err) {
      expect(mockedLogger.error).toBeCalledTimes(1);
    }
  });

  it('returns nothing on success', async () => {
    createTransport.mockReturnValueOnce({
      sendMail: jest.fn().mockResolvedValue(null),
    });

    expect.assertions(0);
    try {
      await sendEmail('');
    } catch (error) {
      expect(error).toBeFalsy();
    }
  });
});
