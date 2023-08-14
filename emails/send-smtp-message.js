import nodemailer from "nodemailer";

import serverRuntimeConfig from "../config/server-runtime-config.js";

async function sendSmtpMessage(messageData) {
  const transporter = nodemailer.createTransport(
    serverRuntimeConfig.smtp
  );

  messageData.from = serverRuntimeConfig.smtp.from;

  const info = await transporter.sendMail(messageData);

  return info;
}

export default sendSmtpMessage;
