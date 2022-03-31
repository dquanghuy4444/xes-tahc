import { ENUM_MESSAGE_INFO_TYPE, ENUM_MESSAGE_TYPE } from '../constants';

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

export class IUserInfor {
	id: string;

	fullName: string;

	avatar: string;

	phoneNumber: string;

	email: string;
}

export class IChatRoom {
	name: string;

	id: string;

	avatar: string;

	isGroup: boolean;
}

export interface ISendMessReq {
	chatRoom: IChatRoom;
	id: string;
	type: ENUM_MESSAGE_TYPE;
	createdBy: string;
	content?: string;
	attachment?: MessageAttachment;
	info?: MessageInfo;
	createdAt: Date;
	userIds: string[];
	userInfors?: IUserInfor[];
	senderInfor: IUserInfor;
}
