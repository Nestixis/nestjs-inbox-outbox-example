import {
  TransactionalEventEmitter,
  TransactionalEventEmitterOperations,
} from '@nestixis/nestjs-inbox-outbox';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Cat } from './cat.model';
import { NewCatEvent } from './new-cat.event';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const transactionalEventEmitter = app.get<TransactionalEventEmitter>(
    TransactionalEventEmitter,
  );

  const cat = new Cat();
  cat.name = 'Mr. Whiskers';

  setInterval(async () => {
    for (let i = 0; i < 250; i++) {
      await transactionalEventEmitter.emit(new NewCatEvent(cat.name, true), [
        {
          entity: cat,
          operation: TransactionalEventEmitterOperations.persist,
        },
      ]);
    }
  }, 10000);

  // await transactionalEventEmitter.emit(new NewCatEvent(cat.name, true), [
  //   {
  //     entity: cat,
  //     operation: TransactionalEventEmitterOperations.persist,
  //   },
  // ]);

  await app.listen(3000);
}
bootstrap();
