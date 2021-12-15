import { Args, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { UserModel } from './models/user.model';
import { MessageModel } from './models/message.model';
import { MessageService } from './message.service';
import { UserMessageWhereInput } from './dto/user-message-where.input';

@Resolver((of) => UserModel)
export class UserResolver {
  constructor(private messageService: MessageService) {}

  @Query((returns) => UserModel, { name: 'user' })
  getUser(@Args('name') name: string): Partial<UserModel> {
    return {
      name: name,
    };
  }

  @ResolveField((_returns) => [MessageModel], { name: 'messages' })
  getMessages(
    @Parent() user: UserModel,
    @Args('where', { nullable: true }) where: UserMessageWhereInput = {},
  ): MessageModel[] {
    if (!where.afterDate) {
      where.afterDate = new Date(new Date().setDate(new Date().getDate() - 30));
    }

    if (!where.limit) {
      where.limit = 100;
    }

    return this.messageService.find({ ...where, recipient: user.name });
  }
}
