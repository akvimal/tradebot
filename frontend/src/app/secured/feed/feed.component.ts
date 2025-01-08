import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WebSocketService } from '../../websocket.service';

@Component({
  imports: [CommonModule,RouterModule],
  template: `
  <input #messageInput type="text" placeholder="Enter message" />
<button (click)="sendMessage(messageInput)">Send</button>

  <button (click)="disconnect()">Stop</button>
  <div *ngFor="let msg of messages">
  {{ msg }}
</div>
  `
})
export class FeedComponent {
    messages: string[] = [];

 constructor(private wsService: WebSocketService){}
  ngOnInit(): void {
    this.wsService.receiveMessages().subscribe((message) => {
      console.log('receive msaage: ',message);
      
      this.messages.push(message.text);
    });
  }

  sendMessage(input: HTMLInputElement) {
    const message = input.value;
    console.log('sending message',message);
    
    this.wsService.sendMessage(message);
    input.value = '';
  }

  disconnect(){
    console.log('disconnected');
    
    this.wsService.disconnect();
  }
}
