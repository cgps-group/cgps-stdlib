import axios from "axios";
import gunzipMaybe from "gunzip-maybe";

import ObjectStorage from "./index.js";

async function importUrl(
  objectUrl,
  bucket,
  key,
) {
  const response = await axios({
    method: "get",
    url: objectUrl,
    responseType: "stream",
  });

  const dataStream = response.data;

  await ObjectStorage.store(
    bucket,
    key,
    dataStream.pipe(gunzipMaybe()),
    true /* compressed */,
    {
      "ContentType": "text/plain",
      "ContentEncoding": "gzip",
    },
  );
}

export default importUrl;
