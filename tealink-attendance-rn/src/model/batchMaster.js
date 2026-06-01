import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class BatchMaster extends Model {
    static table = 'batch_master';

    @field('batch_id') batchId;
    @field('batch_name') batchName;
    @field('div_id') divId;
    @field('shift_id') shiftId;
    @field('batch_type') batchType;

    @readonly @date('created_at') createdAt;
    @readonly @date('updated_at') updatedAt;
}
