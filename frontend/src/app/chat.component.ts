import { Component, OnInit } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
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
}
