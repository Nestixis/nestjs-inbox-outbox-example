import { InboxOutboxModule } from '@nestixis/nestjs-inbox-outbox';
import {
  InboxOutboxTransportEventMigrations,
  TypeORMDatabaseDriverFactory,
  TypeOrmInboxOutboxTransportEvent,
} from '@nestixis/nestjs-inbox-outbox-typeorm-driver';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Cat } from './cat.model';
import { NewCatEvent } from './new-cat.event';
import { NewCatListener } from './new-cat.listener';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'user',
      password: 'user',
      database: 'inbox_outbox',
      entities: [TypeOrmInboxOutboxTransportEvent, Cat],
      migrations: [...InboxOutboxTransportEventMigrations],
      logging: true,
      migrationsRun: true,
    }),
    InboxOutboxModule.registerAsync({
      isGlobal: true,
      imports: [TypeOrmModule.forFeature([TypeOrmInboxOutboxTransportEvent])],
      useFactory: (dataSource: DataSource) => {
        const driverFactory = new TypeORMDatabaseDriverFactory(dataSource);
        return {
          driverFactory: driverFactory,
          events: [
            {
              name: NewCatEvent.name,
              listeners: {
                expiresAtTTL: 1000 * 60 * 60 * 24,
                maxExecutionTimeTTL: 1000 * 60 * 60 * 24,
                readyToRetryAfterTTL: 10000,
              },
            },
          ],
          retryEveryMilliseconds: 5000,
          maxInboxOutboxTransportEventPerRetry: 25,
        };
      },
      inject: [DataSource],
    }),
  ],
  providers: [NewCatListener],
})
export class AppModule {}
