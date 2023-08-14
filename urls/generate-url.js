import config from "../config/public-runtime-config.js";

function generateUrl(baseUrl, path, params) {
  const url = new URL(
    path,
    baseUrl ?? config.baseUrl,
  );

  if (params) {
    for (const [ key, value ] of Object.entries(params)) {
      url.searchParams.append(
        key,
        value,
      );
    }
  }

  return url.href;
}

export default generateUrl;
