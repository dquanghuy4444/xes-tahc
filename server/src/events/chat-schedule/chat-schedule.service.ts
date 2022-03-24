import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IdFromToken } from 'common/decorators/auth.decorator';
import { Model } from 'mongoose';
import { ChatCalendar, ChatCalendarType } from 'resources/chat-calendars/entities/chat-calendar.entity';
import { ENUM_MESSAGE_TYPE } from 'resources/messengers/entities/messenger.entity';
import { MessengersService } from 'resources/messengers/messengers.service';

const NAME_CHAT_SCHEDULE = 'NAME_CHAT_SCHEDULE';

@Injectable()
export class ChatScheduleService {
    constructor(
        @InjectModel(ChatCalendar.name) private chatCalendarModel: Model<ChatCalendar>,
        private readonly messengersService: MessengersService,
    ) {}

    @Cron(CronExpression.EVERY_10_SECONDS, {
        name: NAME_CHAT_SCHEDULE,
    })
    async handleCron(@IdFromToken() idFromToken: string) {
        const calendars = await this.chatCalendarModel.find({
            $or: [{ type: ChatCalendarType.REVERSE_COUNT, numberRuns: 0 }, { type: ChatCalendarType.CALENDAR_DAILY }],
        });

        Promise.all(
            calendars.map(async (cal: ChatCalendar) => {
                await this.messengersService.create(
                    {
                        chatRoomId: cal.chatRoomId,
                        type: ENUM_MESSAGE_TYPE.TEXT,
                        content: cal.content,
                    },
                    idFromToken,
                );

                await cal.updateOne({
                    numberRuns: cal.numberRuns + 1,
                    updatedAt: Date.now(),
                });
            }),
        );
    }
}
