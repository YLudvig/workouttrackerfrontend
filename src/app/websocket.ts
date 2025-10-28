import { Injectable } from "@angular/core";
import {Client, IMessage, StompSubscription} from '@stomp/stompjs'; 
import SockJS from 'sockjs-client';
import { BehaviorSubject } from "rxjs";
import { environment } from "../environments/environment";


@Injectable({providedIn: 'root'})
export class WorkoutWS{
    public client: Client; 
    public sessionUpdates = new BehaviorSubject<any>(null);

    constructor(){
        this.client = new Client({
            brokerURL: undefined, 
            webSocketFactory: () => new SockJS(`${environment.wsUrl}`), 
            reconnectDelay: 2500
        })
    }

    // Metod för att connecta till WS
    connect(onConnected?: (frame: any)=> void){
        this.client.onConnect = (frame) => {
            console.log('Connected:', frame);
            if (onConnected) onConnected(frame);
        }; 

        this.client.onStompError = (frame) => {
            console.error('STOMP error:', frame);
        };

        this.client.activate();
    }

    subscribeToSession(sessionId: string): StompSubscription{
        return this.client.subscribe(`/topic/session/${sessionId}`, (message: IMessage) => {
            const sessionData = JSON.parse(message.body);
            this.sessionUpdates.next(sessionData);
        }); 
    }

    sendMessage(destination: string, payload: any){
        if (this.client.connected){
            this.client.publish({
                destination, 
                body: JSON.stringify(payload)
            })
        }
    }
}