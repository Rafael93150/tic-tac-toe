import { createApp, ref } from "vue";
import NotificationModal from "@/components/modals/NotificationModal.vue";

export function showNotification(props) {
	const { type, message, closingTime, showCloseButton, closeOnOutsideClick } =
		props;

	const closeModal = () => {
		app.unmount();
		notificationContainer.remove();
	};

	const handleClickOutside = (event) => {
		if (!event.target.closest(".modal")) {
			closeModal();
		}
	};

	const onMounted = () => {
		if (closingTime) {
			setTimeout(() => {
				closeModal();
			}, closingTime);
		}
		if (closeOnOutsideClick) {
			document.addEventListener("click", handleClickOutside);
		}
	};

	const onUnmounted = () => {
		if (closeOnOutsideClick) {
			document.removeEventListener("click", handleClickOutside);
		}
	};

	onMounted();

	const app = createApp(NotificationModal, {
		type,
		message,
		closingTime,
		showCloseButton,
        onClose: () => closeModal()
	});

	const notificationContainer = document.createElement("div");
	app.mount(notificationContainer);
	document.body.appendChild(notificationContainer);

	setTimeout(() => {
		app.unmount();
		notificationContainer.remove();
		onUnmounted();
	}, closingTime);
}
