import { Migration } from '@mikro-orm/migrations';

export class Migration20201102192755 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "users" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" varchar(255) not null, "password" varchar(255) not null, "version" int4 not null default 1, "role" text check ("role" in (\'ADMIN\', \'GROWER\', \'BREEDER\', \'MEMBER\')) not null);');
    this.addSql('alter table "users" add constraint "users_pkey" primary key ("id");');
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');
  }

}
