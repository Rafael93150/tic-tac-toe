export default function formatDate(date, justHour = false) {
	const dateObj = new Date(date);
	const today = new Date();
	if (
		dateObj.getDate() === today.getDate() &&
		dateObj.getMonth() === today.getMonth() &&
		dateObj.getFullYear() === today.getFullYear()
	) {
		if (justHour) {
			return dateObj.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
		} else {
			return `Aujourd'hui à ${dateObj.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			})}`;
		}
	} else {
		if (justHour) {
			return dateObj.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
		} else {
			return dateObj.toLocaleString();
		}
	}
}
