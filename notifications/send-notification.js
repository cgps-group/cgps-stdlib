import Pusher from "pusher";

import serverRuntimeConfig from "cgps-stdlib/config/server-runtime-config.js";
import logger from "cgps-stdlib/logger/index.js";

const pusher = new Pusher({
  appId: serverRuntimeConfig.pusherAppId,
  key: serverRuntimeConfig.pusherAppKey,
  secret: serverRuntimeConfig.pusherAppSecret,
  host: serverRuntimeConfig.pusherHost,
  port: serverRuntimeConfig.pusherPort,
  // encrypted: true,
  useTLS: false,
  scheme: "http",
});

async function sendNotification(
  channelId,
  message,
  data,
) {
  const result = await pusher.trigger(channelId, message, data);
  logger.trace(
    { result },
    "pusher notification sent",
  );
  return result;
}

export default sendNotification;
