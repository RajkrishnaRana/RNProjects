import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class ConfigMaster extends Model {
    static table = 'config_master';

    @field('config_id') configId;
    @field('config_value') configValue;

    @readonly @date('created_at') createdAt;
    @readonly @date('updated_at') updatedAt;
}
