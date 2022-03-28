const users = [];

const addUser = ({ id, socketId, roomId }) => {
    const existingUser = users.find(
        (user) => user.roomId === roomId && user.id === id
    );

    if (existingUser) {
        return { error: "Username is taken" };
    }

    const user = { id, socketId, roomId };

    users.push(user);

    return { user };
};

const removeUser = (socketId) => {
    const index = users.findIndex((user) => user.socketId === socketId);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const joinRoom = (roomId , userId) => {
    const user = getUser(userId)
    if(user) {
        user.roomId = roomId;
    }
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (roomId) =>
    users.filter((user) => user.roomId === roomId);

module.exports = { addUser, removeUser, getUser, getUsersInRoom , joinRoom };
