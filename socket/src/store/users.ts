import { IUser } from "../interfaces";

const users: IUser[] = [];

const addUser = (id: string, socketId: string, roomId: string) => {
	const existingUser = users.find(
		(user) => user.roomId === roomId && user.id === id,
	);

	if (existingUser) {
		return { error: 'Username is taken' };
	}

	const user = { id, socketId, roomId };

	users.push(user);

	return { user };
};

const removeUser = (socketId: string) => {
	const index = users.findIndex((user) => user.socketId === socketId);

	if (index !== -1) {
		return users.splice(index, 1)[0];
	}

return null
};

const getUser = (id: string) => users.find((user) => user.id === id);

const joinRoom = (roomId: string, userId: string) => {
	const user = getUser(userId);
	if (user) {
		user.roomId = roomId;
	}
};

const getUsersInRoom = (roomId: string) =>
	users.filter((user) => user.roomId === roomId);

export { addUser, removeUser, getUser, getUsersInRoom, joinRoom };
