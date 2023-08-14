import path from "path";
import EmailTemplates from "email-templates";

import publicRuntimeConfig from "../config/public-runtime-config.js";

async function renderEmailMessage(templateName, data) {
  const email = new EmailTemplates({
    views: {
      root: path.resolve(".", "views", "emails"),
      options: {
        extension: "ejs",
      },
    },
  });

  const globalData = {
    baseUrl: publicRuntimeConfig.baseUrl,
  };

  const rendered = await email.renderAll(
    templateName,
    { ...globalData, ...data }
  );

  const { html, text, subject } = rendered;

  return { html, text, subject };
}

export default renderEmailMessage;
