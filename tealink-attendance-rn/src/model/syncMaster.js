import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class SyncMaster extends Model {
    static table = 'sync_master';

    @field('sync_id') syncId;
    @field('last_sync_date') lastSyncDate;

    @readonly @date('created_at') createdAt;
    @readonly @date('updated_at') updatedAt;
}
