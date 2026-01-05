import nodemailer from "nodemailer";

import logger from "cgps-stdlib/logger/index.js";

import serverRuntimeConfig from "../config/server-runtime-config.js";

async function sendSmtpMessage(messageData) {
  const transporter = nodemailer.createTransport(
    serverRuntimeConfig.smtp
  );

  messageData.from = serverRuntimeConfig.smtp.from;

  logger.debug(
    messageData,
    "Sending SMTP message.",
  );

  const info = await transporter.sendMail(messageData);

  logger.debug(
    info,
    "Sent SMTP message.",
  );

  return info;
}

export default sendSmtpMessage;
