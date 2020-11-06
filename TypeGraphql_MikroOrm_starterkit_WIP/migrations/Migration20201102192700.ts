import { Migration } from '@mikro-orm/migrations';

export class Migration20201102192700 extends Migration {

  async up(): Promise<void> {
    this.addSql('create extension if not exists "uuid-ossp";');
  }

}
