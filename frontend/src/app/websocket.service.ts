import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket | undefined;
  private subject: Subject<any> = new Subject<any>();

  connect(url: string): Observable<any> {
    
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.socket = new WebSocket(url);

      this.socket.onmessage = (event) => {
        this.subject.next(event.data);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket closed');
      };
    }
    return this.subject.asObservable();
  }

  sendMessage(message: any) {
    this.socket?.send(JSON.stringify(message));
  }

  disconnect() {
    this.socket?.close();
  }
}
