import sendSmtpMessage from "./send-smtp-message.js";

async function sendEmailMessage(
  toAddress,
  message,
  attachments,
  replyToAddress,
)
{
  const smtpRequest = {
    text: message.text,
    to: Array.isArray(toAddress) ? toAddress.join(", ") : toAddress,
    subject: message.subject,
    attachment: [],
  };

  if (replyToAddress) {
    smtpRequest.replyTo = replyToAddress;
  }

  if (message.html) {
    smtpRequest.html = message.html;
  }

  if (Array.isArray(attachments)) {
    smtpRequest.attachments = attachments;
  }

  const smtpResponse = await sendSmtpMessage(smtpRequest);

  return smtpResponse;
}

export default sendEmailMessage;
