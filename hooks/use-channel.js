import Ably from "ably/promises";
import { useEffect } from "react";

import publicRuntimeConfig from "cgps-stdlib/config/public-runtime-config.js";

export function useChannel(channelName, callbackOnMessage) {
  const ably = new Ably.Realtime.Promise({ key: publicRuntimeConfig.notificationsPublicApiKey });
  const channel = ably.channels.get(channelName);

  const onMount = () => {
    channel.subscribe((msg) => { callbackOnMessage(msg); });
  };

  const onUnmount = () => {
    channel.unsubscribe();
  };

  const useEffectHook = () => {
    onMount();
    return () => { onUnmount(); };
  };

  useEffect(useEffectHook);

  return [channel, ably];
}
