import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { MY_NAME, SOCKET_EVENT_NAMES } from './constants';
import {
	addUser,
	removeUser,
	getUser,
	joinRoom,
	getUsersInRoom,
} from './store/users';
import {
	ICreateRoomReq,
	IJoinRoomReq,
	ISendMessReq,
	ISendUserIDReq,
	IUser,
} from './interfaces';
import { fetchData } from './helper';

dotenv.config();

const app = express();
const server = new http.Server(app);
const io = new Server(server, {
	cors: {
		origin  : process.env.CONNECT_CLIENT_URL || 'http://localhost:3000',
		methods : ['GET', 'POST'],
	},
	serveClient  : false,
	pingInterval : 10000,
	pingTimeout  : 5000,
	cookie       : false,
});

server.listen(process.env.PORT || 6798, () => {
	console.log(`Server on port ${process.env.PORT}`);
});

io.on('connection', (socket) => {
	console.log(`New Socket ID :${socket.id}`);

	socket.on('disconnect', async() => {
		console.log('------------------------------');
		console.log(`Disconnect ID :${socket.id}`);
		console.log('------------------------------');

		const removedId = await removeUser(socket.id);

		const res = await fetchData(`chat-rooms/private/${removedId}`);
		if (!res) {
			return;
		}
		res.forEach((info: any) => {
			const user: IUser = getUser(info.userId);
			if (!user) {
				return;
			}
			io.to(user.socketId).emit(
				SOCKET_EVENT_NAMES.SERVER_SOCKET.STATUS_USER,
				{
					...info,
					isOnline: false,
				},
			);
		});
	});

	socket.on(
		SOCKET_EVENT_NAMES.CLIENT.SEND_USERID,
		async({ id }: ISendUserIDReq) => {
			await addUser(id, socket.id, '');

			const res = await fetchData(`chat-rooms/private/${id}`);
			if (!res) {
				return;
			}
			res.forEach((info: any) => {
				const user: IUser = getUser(info.userId);
				if (!user) {
					return;
				}
				io.to(user.socketId).emit(
					SOCKET_EVENT_NAMES.SERVER_SOCKET.STATUS_USER,
					{
						...info,
						isOnline: true,
					},
				);
			});
		},
	);

	socket.on(
		SOCKET_EVENT_NAMES.CLIENT.JOIN_ROOM,
		({ roomId, userId }: IJoinRoomReq) => {
			joinRoom(roomId, userId);
		},
	);

	socket.on(
		SOCKET_EVENT_NAMES.CLIENT.SEND_MESSENGER,
		(data: ISendMessReq) => {
			const users: IUser[] = getUsersInRoom(data.chatRoom.id);
			if (users?.length > 0) {
				users.forEach((user: IUser) => {
					if (user?.socketId) {
						io.to(user.socketId).emit(
							SOCKET_EVENT_NAMES.SERVER_SOCKET
								.SEND_DATA_FOR_CHAT_ROOM_MESSENGERS,
							data,
						);
					}
				});
			}

			data.userIds.forEach((userId: string) => {
				const user: IUser = getUser(userId);
				if (!user) {
					return;
				}
				const { id, name, avatar, isGroup } = data.chatRoom;

				const roomName = isGroup
					? name
					: data.userInfors?.find((i) => i.id !== userId)?.fullName ||
					  'Chat riêng';
				const roomAvatar = isGroup
					? avatar
					: data.userInfors?.find((i) => i.id !== userId)?.avatar ||
					  '';

				io.to(user.socketId).emit(
					SOCKET_EVENT_NAMES.SERVER_SOCKET
						.SEND_DATA_FOR_CHAT_ROOM_DESCRIPTION,
					{
						id,
						lastMessengerInfor: {
							type       : data.type,
							content    : data.content,
							attachment : data?.attachment,
							info       : data?.info,
							createdAt  : data?.createdAt,
							createdBy  : data?.createdBy,
							userName   :
								userId === data?.createdBy
									? MY_NAME
									: data.senderInfor.fullName,
						},
						name   : roomName,
						avatar : roomAvatar,
						isGroup,
					},
				);
			});
		},
	);

	socket.on(SOCKET_EVENT_NAMES.CLIENT.CREATE_ROOM, (data: ICreateRoomReq) => {
		data.userIds.forEach((userId: string) => {
			const user: IUser = getUser(userId);
			if (user) {
				io.to(user.socketId).emit(
					SOCKET_EVENT_NAMES.SERVER_SOCKET
						.SEND_DATA_FOR_CHAT_ROOM_DESCRIPTION,
					data,
				);
			}
		});
	});
});
