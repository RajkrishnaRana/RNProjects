import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class RequestParamMaster extends Model {
    static table = 'request_param_master';

    @field('request_id') requestId;
    @field('param_name') paramName;
    @field('param_value') paramValue;

    @readonly @date('created_at') createdAt;
    @readonly @date('updated_at') updatedAt;
}
