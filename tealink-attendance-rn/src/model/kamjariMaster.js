import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class KamjariMaster extends Model {
    static table = 'kamjari_master';

    @field('kamjari_id') kamjariId;
    @field('kamjari_code') kamjariCode;
    @field('kamjari_name') kamjariName;
    @field('kamjari_is_active') kamjariIsActive;
    @field('kamjari_parent_id') kamjariParentId;
    @field('kamjari_type') kamjariType;
    @field('kamjari_is_default') kamjariIsDefault;

    @readonly @date('created_at') createdAt;
    @readonly @date('updated_at') updatedAt;
}
