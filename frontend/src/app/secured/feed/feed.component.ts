import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WebSocketService } from '../../websocket.service';

@Component({
  imports: [CommonModule,RouterModule],
  template: `
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
    this.wsService.sendMessage(message);
    input.value = '';
  }

  disconnect(){
    this.wsService.disconnect();
  }
}
