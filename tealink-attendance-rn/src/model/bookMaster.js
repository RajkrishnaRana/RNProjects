import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class BookMaster extends Model {
    static table = 'book_master';

    @field('book_id') bookId;
    @field('book_name') bookName;

    @readonly @date('created_at') createdAt;
    @readonly @date('updated_at') updatedAt;
}
