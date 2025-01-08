import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket: Socket;

  constructor() {
    const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwicGFydG5lcklkIjoiIiwiZXhwIjoxNzM2ODUxOTQwLCJ0b2tlbkNvbnN1bWVyVHlwZSI6IlNFTEYiLCJ3ZWJob29rVXJsIjoiIiwiZGhhbkNsaWVudElkIjoiMTEwMTEyMTUxNSJ9.sP82yLDVq4OrdMvCdtGIiT6uFLUEs_GDa-Vr-g53L4B324NR-8gyj7eiKh2ogqxieaKtob5NskICj2JMYRAbQw`;
        const clientId = `1101121515`;
        
        const url = `wss://api-feed.dhan.co?version=2&token=${token}&clientId=${clientId}&authType=2`
        console.log('connecting ws ...');
        // const url = 'ws://localhost:3000';
         
    this.socket = io(url, { transports : ['websocket'] });
  }

  sendMessage(message: string) {
    console.log('sending ...',message);
    
    this.socket.emit('message', { text: message });
  }

  receiveMessages(): Observable<any> {
    console.log('....');
    
    return new Observable((subscriber) => {
      console.log('subscriber:',subscriber);
      
      this.socket.on('message', (data) => {
        console.log('received',data);
        
        subscriber.next(data);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('disconnected');
      
    }
  }
  
  connect() {
    if (this.socket) {
      this.socket.connect();
      console.log('connected');
      
    }
  }
}