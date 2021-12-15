import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageService],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should store messages', () => {
    service.addMessage('sender', 'recipient', 'message');

    expect(service.find()).toHaveLength(1);
  });

  it('should filter by recipient', () => {
    service.addMessage('sender1', 'recipient1', 'message1');
    service.addMessage('sender2', 'recipient2', 'message2');

    expect(service.find({ recipient: 'recipient1' })).toHaveLength(1);
  });

  it('should filter by sender', () => {
    service.addMessage('sender1', 'recipient1', 'message1');
    service.addMessage('sender2', 'recipient2', 'message2');

    expect(service.find({ sender: 'sender1' })).toHaveLength(1);
  });

  it('should limit number of messages', () => {
    service.addMessage('sender1', 'recipient1', 'message1');
    service.addMessage('sender2', 'recipient2', 'message2');

    expect(service.find({ limit: 1 })).toHaveLength(1);
  });

  it('should filter by date', () => {
    const januarySecond = new Date('2021-01-02');
    const januaryFifteenth = new Date('2021-01-15');
    const januaryThirtyFirst = new Date('2021-01-31');

    jest.useFakeTimers();
    jest.setSystemTime(januarySecond.getTime());

    service.addMessage('sender1', 'recipient1', 'message1');

    jest.setSystemTime(januaryThirtyFirst.getTime());

    service.addMessage('sender2', 'recipient2', 'message2');

    jest.useRealTimers();

    expect(service.find({ afterDate: januaryFifteenth })).toHaveLength(1);
  });
});
