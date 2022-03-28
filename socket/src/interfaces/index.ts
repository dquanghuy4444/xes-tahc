import { ENUM_MESSAGE_INFO_TYPE, ENUM_MESSAGE_TYPE } from "../constants";

export interface IUser {
	id: string;
	socketId: string;
	roomId: string;
}

export interface ISendUserIDReq {
	id: string;
}

export interface IJoinRoomReq {
	roomId: string;
	userId: string;
}

export interface ICreateRoomReq {
	id: string;
	name: string;
	isGroup: boolean;
	avatar: string;
	createdBy: string;
	createdAt: Date;
	userIds: string[];
}


export class MessageInfo {
    type: ENUM_MESSAGE_INFO_TYPE;

    victim?: string;
}

export class MessageAttachment {
    name: string;

    path: string;
}

export interface ISendMessReq {
    id: string;
    type: ENUM_MESSAGE_TYPE;
    chatRoomId: string;
    createdBy: string;
    content?: string;
    attachment?: MessageAttachment;
    info?: MessageInfo;
    createdAt: Date;
    userIds: string[];
}

