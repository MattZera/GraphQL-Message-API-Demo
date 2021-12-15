import { Injectable } from '@nestjs/common';
import { Message } from './models/message.model';

@Injectable()
export class MessageService {
  private messages: Message[] = [];

  addMessage(sender: string, recipient: string, message: string) {
    this.messages.push({ sender, recipient, message, date: new Date() });
    return {
      ...this.messages[this.messages.length - 1],
    };
  }

  find(
    params: {
      sender?: string;
      recipient?: string;
      afterDate?: number | Date;
      limit?: number;
    } = {},
  ) {
    let messages: Message[] = [...this.messages];

    if (params.recipient) {
      messages = messages.filter((message) => message.recipient === params.recipient);
    }

    if (params.sender) {
      messages = messages.filter((message) => message.sender === params.sender);
    }

    if (params.afterDate) {
      let afterDate = params.afterDate;
      if (typeof afterDate !== 'number') {
        afterDate = afterDate.getTime();
      }
      messages = messages.filter((message) => {
        let messageDate = message.date.getTime();
        console.log(messageDate);
        return messageDate > afterDate;
      });
    }

    if (params.limit) {
      messages = messages.slice(0, params.limit);
    }

    return messages;
  }
}
