import {Field, InputType} from "@nestjs/graphql";
import {IsOptional, MaxLength } from "class-validator";

@InputType()
export class UserMessageWhereInput {
    @Field({ nullable: true })
    @MaxLength(30)
    @IsOptional()
    sender?: string;

    @Field({ nullable: true })
    @IsOptional()
    afterDate?: Date

    @Field({ nullable: true })
    @IsOptional()
    limit?: number;
}