import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class AuthorizedUserMaster extends Model {
    static table = 'authorized_user_master';

    @field('authorized_user_id') userId;
    @field('authorized_user_name') userName;
    @field('authorized_user_email') userEmail;

    @readonly @date('created_at') createdAt;
    @readonly @date('updated_at') updatedAt;
}
