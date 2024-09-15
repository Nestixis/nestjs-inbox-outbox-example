import { InboxOutboxEvent } from '@nestixis/nestjs-inbox-outbox';

export class NewCatEvent implements InboxOutboxEvent {
  public readonly name = NewCatEvent.name;

  constructor(
    public readonly catName: string,
    public readonly isFluffy: boolean,
  ) {}
}
