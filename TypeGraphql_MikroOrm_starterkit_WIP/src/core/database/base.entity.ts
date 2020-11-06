import {PrimaryKey, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";


@ObjectType()
export class Base {
    @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
    id: string;

    @Field()
    @Property({
        type: Date
    })
    createdAt: Date = new Date();

    @Field()
    @Property({ type: Date, onUpdate: () => new Date()})
    updatedAt: Date = new Date();

}
