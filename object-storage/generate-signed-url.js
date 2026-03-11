import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import client from"./client.js";

async function generateSignedUrl(
  cmd,
  expiresInHours = 1,
) {
  const url = await getSignedUrl(
    client, 
    cmd, 
    { expiresIn: expiresInHours * 3600 },
  );
  return url;
}

export default generateSignedUrl;
