import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class NotificationMaster extends Model {
    static table = 'notification_master';

    @field('notification_id') notificationId;
    @field('notification_header') notificationHeader;
    @field('notification_body') notificationBody;
    @field('notification_time_stamp') notificationTimeStamp;
    @field('notification_read') notificationRead;

    @readonly @date('created_at') createdAt;
    @readonly @date('updated_at') updatedAt;
}
