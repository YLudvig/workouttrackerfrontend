import { Injectable } from "@angular/core";
import {Client, IMessage, StompSubscription} from '@stomp/stompjs'; 
import SockJS from 'sockjs-client';
import { BehaviorSubject } from "rxjs";
import { environment } from "../environments/environment";
import { WorkoutSession } from "./types/Workoutsession";


@Injectable({providedIn: 'root'})
export class WorkoutWS{
    public client: Client; 

    public sessionUpdates = new BehaviorSubject<WorkoutSession | null>(null);

    constructor(){
        this.client = new Client({
            brokerURL: undefined, 
            webSocketFactory: () => new SockJS(`${environment.wsUrl}?userId=${localStorage.getItem('userId')}`), 
            reconnectDelay: 2500
        })
    }

    // Metod för att connecta till WS
    connect(onConnected?: (frame: any)=> void){
        this.client.onConnect = (frame) => {
            console.log('Connected:', frame);
            console.log("Frame headers", frame.headers);
            if (onConnected) onConnected(frame);
        }; 

        // Om stomp error
        this.client.onStompError = (frame) => {
            console.error('STOMP error:', frame);
        };

        // Om WS koppling bryts oväntat
        this.client.onWebSocketClose = () => console.warn('WS stängt');

        // Vid WS error
        this.client.onWebSocketError = (err) => console.error('WS error', err); 

        // Aktiverar client connection till WS
        this.client.activate();
    }

    // WS subscribar till en specifik session 
    subscribeToSession(sessionId: string): StompSubscription{
        console.log(`Subscribad till: /topic/session/${sessionId}`)
        return this.client.subscribe(`/topic/session/${sessionId}`, (message: IMessage) => {
            const sessionData = JSON.parse(message.body);
            console.log(sessionData);
            this.sessionUpdates.next(sessionData);
        }); 
    }



    sendMessage(destination: string, payload: any){
        if (this.client.connected){
            this.client.publish({
                destination, 
                body: JSON.stringify(payload)
            })
        } else {
            console.error("WS error med sendMessage funktionen");
        }
    }

    // Uppdaterar en övning under session
    updateExercise(sessionId: string, exercise: any){
        this.sendMessage("/app/session/updateExercise", {sessionId, exercise});
    }

    // Kopplar loss från WS
    disconnect(){
        if (this.client.active){
            console.log("Disconnectar från WS")
            this.client.deactivate();
        }
    }
}