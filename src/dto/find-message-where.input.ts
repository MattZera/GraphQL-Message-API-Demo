import {Field, InputType} from "@nestjs/graphql";
import {MaxLength, IsOptional} from "class-validator";

@InputType()
export class FindMessageWhereInput {
    @Field({nullable: true})
    @MaxLength(30)
    @IsOptional()
    sender?: string;

    @Field({nullable: true})
    @MaxLength(30)
    @IsOptional()
    recipient?: string;

    @Field({nullable: true})
    @IsOptional()
    afterDate?: Date

    @Field({nullable: true})
    @IsOptional()
    limit?: number;
}