require("dotenv").config();

const { SOCKET_EVENT_NAMES } = require("./constants");
const { addUser, removeUser, getUser, joinRoom , getUsersInRoom } = require("./users");

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    cors: {
        origin: process.env.CONNECT_CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
    },
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false,
});

server.listen(process.env.PORT || 6798);

io.on("connection", (socket) => {
    console.log("New Socket ID :" + socket.id);

    socket.on("disconnect", () => {
        console.log("------------------------------");
        console.log("Disconnect ID :" + socket.id);
        console.log("------------------------------");

        removeUser(socket.id);

        // socket.broadcast.emit("server-send-listusers", arrUsers);
        // socket.broadcast.emit("server-send-userlogout", socket.Username);
    });

    socket.on(SOCKET_EVENT_NAMES.CLIENT.SEND_USERID, ({ id }) => {
        addUser({
            id,
            socketId: socket.id,
            room: "",
        });
    });

    socket.on(SOCKET_EVENT_NAMES.CLIENT.JOIN_ROOM, ({ roomId, userId }) => {
        joinRoom(roomId, userId);
    });

    socket.on(SOCKET_EVENT_NAMES.CLIENT.SEND_MESSENGER, (data) => {
        const users = getUsersInRoom(data.chatRoomId);
        if(users?.length > 0) {
            users.forEach((user) => {
                if (user?.socketId) {
                    io.to(user.socketId).emit(
                        SOCKET_EVENT_NAMES.SERVER_SOCKET
                            .SEND_DATA_FOR_CHAT_ROOM_MESSENGERS,
                        data
                    );
                }
            });
        }
    });

    socket.on(SOCKET_EVENT_NAMES.CLIENT.CREATE_ROOM, (data) => {
        data.userIds.forEach((userId) => {
            const user = getUser(userId);
            if (user) {
                io.to(user.socketId).emit(
                    SOCKET_EVENT_NAMES.SERVER_SOCKET
                        .SEND_DATA_FOR_CHAT_ROOM_DESCRIPTION,
                    data
                );
            }
        });
    });

    // socket.on("client-send-username", (data) => {
    //     if (arrUsers.indexOf(data) >= 0) {
    //         socket.emit("server-send-reg-fail");
    //     } else {
    //         socket.Username = data;
    //         arrUsers.push(data);
    //         socket.emit("server-send-reg-success", data);
    //         io.sockets.emit("server-send-listusers", arrUsers);
    //         socket.broadcast.emit("server-send-userlogin", socket.Username);
    //     }
    // });

    // socket.on("client-send-logoutevent", () => {
    //     arrUsers.splice(arrUsers.indexOf(socket.Username), 1);

    //     socket.broadcast.emit("server-send-listusers", arrUsers);
    //     socket.broadcast.emit("server-send-userlogout", socket.Username);
    // });

    // socket.on("client-send-mess", (data) => {
    //     const text = socket.Username + " : " + data;
    //     socket.broadcast.emit("server-send-mess-forglobal", text);
    //     const text2 = "Tôi : " + data;
    //     socket.emit("server-send-mess-forme", text2);
    // });

    // socket.on("client-send-writingevent", () => {
    //     if (arrUsersWriting.indexOf(socket.Username) < 0) {
    //         arrUsersWriting.push(socket.Username);
    //         socket.broadcast.emit(
    //             "server-send-listuserswriting",
    //             arrUsersWriting
    //         );
    //     }
    // });

    // socket.on("client-send-stopwritingevent", () => {
    //     if (arrUsersWriting.indexOf(socket.Username) >= 0) {
    //         arrUsersWriting.splice(arrUsersWriting.indexOf(socket.Username), 1);

    //         socket.broadcast.emit(
    //             "server-send-listuserswriting",
    //             arrUsersWriting
    //         );
    //     }
    // });
});
