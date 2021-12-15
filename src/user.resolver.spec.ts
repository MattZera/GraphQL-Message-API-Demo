import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { MessageService } from './message.service';
import { UserModel } from './models/user.model';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let mockMessagesService;

  beforeEach(async () => {
    mockMessagesService = {
      addMessage: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: MessageService,
          useFactory: () => {
            return mockMessagesService;
          },
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return a an object containing a name', () => {
    expect(resolver.getUser('mike')).toEqual({ name: 'mike' });
  });

  it('should have a default limit of 100', () => {
    resolver.getMessages({ name: 'user' } as UserModel);
    expect(mockMessagesService.find.mock.calls[0][0].limit).toEqual(100);
  });

  it('should have a default date of 30 days ago', () => {
    const januaryThirtyFirst = new Date('2021-01-31');
    let januaryFirst = new Date('2021-01-01').getTime();

    jest.useFakeTimers();
    jest.setSystemTime(januaryThirtyFirst.getTime());

    resolver.getMessages({ name: 'user' } as UserModel);

    jest.useRealTimers();

    expect(mockMessagesService.find.mock.calls[0][0].afterDate.getTime()).toEqual(januaryFirst);
  });
});
