import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum MessageType {
  INFO,
  WARNING,
  ERROR,
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: BehaviorSubject<
    { type: MessageType; id: number; message: string; time: number }[]
  >;
  private current_id: number;
  public current_messages: {
    type: MessageType;
    id: number;
    message: string;
    time: number;
  }[];
  constructor() {
    this.messages = new BehaviorSubject<
      { type: MessageType; id: number; message: string; time: number }[]
    >([]);
    this.current_id = 0;
    this.current_messages = [];
  }

  getMessagesObserver() {
    return this.messages.asObservable();
  }

  removeMessage(id: number) {
    const index = this.current_messages
      .map((message) => message.id)
      .findIndex((current_id) => current_id === id);
    if (index < 0) {
      return;
    }
    this.current_messages.splice(index, 1);

    this.messages.next(this.current_messages);
  }

  addMessage(type: MessageType, message: string, time: number = 4000) {
    this.current_messages.push({
      type: type,
      id: this.current_id,
      message: message,
      time: time,
    });
    this.messages.next(this.current_messages);
    const id = this.current_id;
    setTimeout(() => {
      this.removeMessage(id);
    }, time);
    this.current_id++;
  }
}
