import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class WorkerTypeMaster extends Model {
    static table = 'worker_type_master';

    @field('workertype_id') workerTypeId;
    @field('workertype_name') workerTypeName;
    @field('workertype_subtype') workerTypeSubType;

    @readonly @date('created_at') createdAt;
    @readonly @date('updated_at') updatedAt;
}
