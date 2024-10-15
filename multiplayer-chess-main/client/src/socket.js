import { io } from "socket.io-client"; // import connection function

const socket = io('https://chessgame-9o47.onrender.com'); // initialize websocket connection

export default socket;