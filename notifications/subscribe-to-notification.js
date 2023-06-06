import PusherJS from "pusher-js";

import publicRuntimeConfig from "cgps-stdlib/config/public-runtime-config.js";
import logger from "cgps-stdlib/logger/index.js";

function subscribeToNotification(
  channelId,
  message,
  callback,
) {
  logger.trace(
    {
      channelId,
      message,
    },
    "subscribe to notification",
  );

  const client = new PusherJS(
    publicRuntimeConfig.pusherAppKey,
    {
      host: publicRuntimeConfig.pusherHost,
      wsHost: publicRuntimeConfig.pusherHost,
      wsPort: publicRuntimeConfig.pusherPort,
      httpHost: publicRuntimeConfig.pusherHost,
      httpPort: publicRuntimeConfig.pusherPort,
      forceTLS: false,
      // encrypted: true,
      enabledTransports: [ "ws" ],
    },
  );

  client
    .subscribe(channelId)
    .bind(
      message,
      callback,
    );

  return client;
}

export default subscribeToNotification;
