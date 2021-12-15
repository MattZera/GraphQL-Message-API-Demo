import {Field, ObjectType} from "@nestjs/graphql";
import {MessageModel} from "./message.model";

@ObjectType("User",{ description: 'user' })
export class UserModel {
    @Field()
    name: string;

    @Field(_type => [MessageModel])
    messages: MessageModel[];
}