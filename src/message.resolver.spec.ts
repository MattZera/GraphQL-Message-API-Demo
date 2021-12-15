import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { MessageResolver } from './messageResolver';

describe('MessagesResolver', () => {
  let resolver: MessageResolver;
  let mockMessagesService;

  beforeEach(async () => {
    mockMessagesService = {
      addMessage: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageResolver,
        {
          provide: MessageService,
          useFactory: () => {
            return mockMessagesService;
          },
        },
      ],
    }).compile();

    resolver = module.get<MessageResolver>(MessageResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should have a default limit of 100', () => {
    resolver.getMessages();
    expect(mockMessagesService.find.mock.calls[0][0].limit).toEqual(100);
  });

  it('should have a default date of 30 days ago', () => {
    const januaryThirtyFirst = new Date('2021-01-31');
    let januaryFirst = new Date('2021-01-01').getTime();

    jest.useFakeTimers();
    jest.setSystemTime(januaryThirtyFirst.getTime());

    resolver.getMessages();

    jest.useRealTimers();

    expect(mockMessagesService.find.mock.calls[0][0].afterDate.getTime()).toEqual(januaryFirst);
  });

  it('should add messages using message service', () => {
    let message = { sender: 'sender', recipient: 'recipient', message: 'message' };
    resolver.sendMessage(message);
    expect(mockMessagesService.addMessage.mock.calls[0][0]).toEqual('sender');
    expect(mockMessagesService.addMessage.mock.calls[0][1]).toEqual('recipient');
    expect(mockMessagesService.addMessage.mock.calls[0][2]).toEqual('message');
  });
});
