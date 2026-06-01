import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class RequestHeaderMaster extends Model {
    static table = 'request_header_master';

    @field('request_id') requestId;
    @field('header_name') headerName;
    @field('header_value') headerValue;

    @readonly @date('created_at') createdAt;
    @readonly @date('updated_at') updatedAt;
}
