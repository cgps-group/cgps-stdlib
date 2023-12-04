import isToday from "date-fns/isToday";
import isYesterday from "date-fns/isYesterday";
import formatDistance from "date-fns/formatDistance";

function distanceInWords(dateString) {
  const date = new Date(dateString);
  return formatDistance(
    new Date(dateString),
    new Date(),
    {
      "addSuffix": false,
    },
  );
  if (isToday(date)) {
    return "Today";
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
}

export default distanceInWords;
