import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SendMessageInput } from './dto/send-message.input';
import { MessageService } from './message.service';
import { MessageModel } from './models/message.model';
import { FindMessageWhereInput } from './dto/find-message-where.input';

@Resolver((of) => String)
export class MessageResolver {
  constructor(private messageService: MessageService) {}

  @Query((_returns) => [MessageModel], { name: 'messages' })
  getMessages(@Args('where', { nullable: true }) where: FindMessageWhereInput = {}): MessageModel[] {
    if (!where.afterDate) {
      const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
      where.afterDate = thirtyDaysAgo;
    }

    if (!where.limit) {
      where.limit = 100;
    }
    return this.messageService.find(where);
  }

  @Mutation((_returns) => MessageModel)
  async sendMessage(@Args('message') message: SendMessageInput): Promise<MessageModel> {
    return this.messageService.addMessage(message.sender, message.recipient, message.message);
  }
}
