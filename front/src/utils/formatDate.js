export default function formatDate(date) {
  const dateObj = new Date(date);
  const today = new Date();
  if (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  ) {
    return `Aujourd'hui à ${dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else {
    return dateObj.toLocaleString();
  }
}
