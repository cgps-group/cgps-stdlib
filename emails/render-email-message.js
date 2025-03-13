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

  const brandColor = "#548391"; // "#346df1"

  const globalData = {
    baseUrl: publicRuntimeConfig.baseUrl,
    colorBackground: "#f9f9f9",
    colorMainBackground: "#fff",
    colorText: "#444",
    colorButtonBackground: brandColor,
    colorButtonText: "#fff",
    colorButtonBorder: brandColor,
  };

  const rendered = await email.renderAll(
    templateName,
    { ...globalData, ...data }
  );

  const { html, text, subject } = rendered;

  return { html, text, subject };
}

export default renderEmailMessage;
