import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  connectionId;
  webSocket: WebSocketSubject<any> = webSocket(environment.urlSocket);

  constructor() {}

  connect() {

    return this.webSocket
  }

  disconect(){
    this.webSocket.next({ action: 'disconnectLive' });
    this.webSocket.complete();
  }


}
