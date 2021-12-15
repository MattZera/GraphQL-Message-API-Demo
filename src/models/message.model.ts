import { Field, ID, ObjectType } from '@nestjs/graphql';

export interface Message {
    sender: string;
    recipient: string;
    message: string;
    date: Date
}

@ObjectType("Message",{ description: 'message' })
export class MessageModel implements Message{
    @Field()
    sender: string;

    @Field()
    recipient: string;

    @Field()
    message: string;

    @Field()
    date: Date
}