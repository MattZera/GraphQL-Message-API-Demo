import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { GraphQLModule } from '@nestjs/graphql';
import { MessageResolver } from './messageResolver';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: false,
      playground: true,
      autoSchemaFile: true,
      sortSchema: true,
      installSubscriptionHandlers: true,
    }),
  ],
  providers: [MessageService, MessageResolver, UserResolver],
})
export class AppModule {}
