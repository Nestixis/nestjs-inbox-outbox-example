import { IListener, Listener } from '@nestixis/nestjs-inbox-outbox';
import { NewCatEvent } from './new-cat.event';

@Listener(NewCatEvent.name)
export class NewCatListener implements IListener<NewCatEvent> {
  getName(): string {
    return NewCatListener.name;
  }

  async handle(event: NewCatEvent): Promise<void> {
    console.log(`A new and cute cat appeared with name ${event.catName}`);
  }
}
