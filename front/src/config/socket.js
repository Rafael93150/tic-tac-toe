import io from "socket.io-client";

const URL = import.meta.env.VITE_HOST_API;
const socket = io(URL);

export default socket;
