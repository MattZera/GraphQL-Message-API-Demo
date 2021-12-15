import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, Length, MaxLength } from 'class-validator';

@InputType()
export class SendMessageInput {
    @Field()
    @MaxLength(30)
    sender: string;

    @Field()
    @MaxLength(30)
    recipient: string;

    @Field()
    @MaxLength(320)
    message: string;
}