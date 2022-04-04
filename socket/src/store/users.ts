import { putData } from '../helper';
import { IUser } from '../interfaces';

const users: IUser[] = [];

const addUser = async(id: string, socketId: string, roomId: string) => {
    const existingUser = users.find(
        (user) => user.roomId === roomId && user.id === id,
    );

    if (existingUser) {
        return { error: 'Username is taken' };
    }

    const user = { id, socketId, roomId };

    users.push(user);

    await putData('users/status', {
        id,
        isOnline: true,
    });
};

const removeUser = async(socketId: string) => {
    const index = users.findIndex((user) => user.socketId === socketId);

    if (index !== -1) {
        const { id } = users[index];
        await putData('users/status', {
            id,
            isOnline: false,
        });
        const roomId = users[index]?.roomId || ""
        if (roomId) {
            await putData(`chat-rooms/${roomId}/me/last-time-reading`);
        }

        users.splice(index, 1);

        return id
    }
};

const getUser = (id: string) => users.find((user) => user.id === id);

const joinRoom = async(roomId: string, userId: string) => {
    const user = getUser(userId);
    if (user) {
        user.roomId = roomId;
        await putData(`chat-rooms/${roomId}/me/last-time-reading`);

    }
};

const getUsersInRoom = (roomId: string) =>
    users.filter((user) => user.roomId === roomId);

export { addUser, removeUser, getUser, getUsersInRoom, joinRoom };
