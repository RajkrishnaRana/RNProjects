import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class OfflineMaster extends Model {
    static table = 'offline_master';

    @field('request_id') requestId;
    @field('request_type') requestType;
    @field('request_url') requestURL;
    @field('request_body') requestBody;
    @field('request_idendtifier') requestIdentifier;
    @field('under_processing') underProcessing;
    @field('retry_count') retryCount;
    @field('delete_file') deleteFile;

    @readonly @date('created_at') createdAt;
    @readonly @date('updated_at') updatedAt;
}
