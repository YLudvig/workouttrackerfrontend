import { Injectable } from "@angular/core";
import {Client, IMessage, StompSubscription} from '@stomp/stompjs'; 
import SockJS from 'sockjs-client';
import { environment } from "../environments/environment";
import { WorkoutSession } from "./types/Workoutsession";
import { CreateSessionRequest, JoinSessionRequest, SessionEvent } from "./types/WSTypes";


@Injectable({providedIn: 'root'})
export class WorkoutWS{




    private client: Client | null = null; 
    // Lista över aktiva subscriptions
    private activeSubscriptions = new Map<string, any>(); 
    // används för att hållakoll på vilka koder som har subcribers och reconnecta om de dcar
    private subscribedCodes = new Set<string>();

    // Connecta till websocket
    connect(): void{
        if (this.client && this.client.active) return; 
        
        this.client = new Client({
            webSocketFactory: () => new SockJS(`${environment.wsUrl}`), 
            reconnectDelay: 3000, 
            onConnect: () => {
                console.log('WS kopplat')

                this.client!.subscribe('/user/queue/create-response', (message: IMessage) => {
                    const response = JSON.parse(message.body);
                    console.log('Createsessionresponsen:', response); 
                })
                
                this.subscribedCodes.forEach(code => {
                    if (!this.subscribedCodes.has(code)){
                        this.subscribeToSession(code, () => {});
                    }
                })
            }, 
            onStompError: (frame) => console.error('WS error', frame),
        })
        this.client.activate();

        
    }


    // Subscribea till WS session för att få specifik info därifrån 
    subscribeToSession(sessionCode : string, handler: (sessionEvent: SessionEvent) => void) : void{
        if(!this.client || !this.client.active) {
            throw new Error('WS inte kopplat');
        }

        if (this.activeSubscriptions.has(sessionCode)) this.unsubscribe(sessionCode);

        const subscribe = this.client.subscribe(`/topic/session.${sessionCode}`, (message: IMessage) => {
            try {
                const payload = JSON.parse(message.body);
                handler(payload);

            } catch (err) {
                console.error('Failed to parse message body', err, message.body); 
            }
        }); 
        this.activeSubscriptions.set(sessionCode, subscribe);
        this.subscribedCodes.add(sessionCode);
    }

    sendMessage(destination: string, payload: any): void{
        if (!this.client || !this.client.active) throw new Error('Inte kopplad');

        this.client.publish({
            destination: `/app/${destination}`, 
            body: JSON.stringify(payload)
        })
    }

    // Behöver ett sätt att unsubcribea användare från WS 
    unsubscribe(sessionCode: string): void {
        const session = this.activeSubscriptions.get(sessionCode);
        if (session){
            session.unsubscribe();
            this.activeSubscriptions.delete(sessionCode);
        }
        this.subscribedCodes.delete(sessionCode);
    }

    // Disconnecta från WS 
    disconnect(): void {
        if (this.client){
            try { this.client.deactivate(); } catch (e) { console.warn('Error när du försökte deaktivera WS')}
        }
        this.activeSubscriptions.clear();
        this.subscribedCodes.clear();
        this.client = null; 
    }

    createSession(request: CreateSessionRequest): void {
        this.sendMessage('session-create', request);
    }

    joinSession(request: JoinSessionRequest): void{
        this.sendMessage('session-join', request);
    }

    startSession(sessionCode: string, hostUserId: number): void {
        const sessionEvent : SessionEvent = {
            sessionCode, 
            actorUserId: hostUserId, 
            event: 'START_REQUEST', 
            payload: {}
        }
        this.sendMessage('session-start', sessionEvent)
    }

    sendUpdate(sessionCode: string, userId: number, payload: Record<string, any>): void {
        const sessionEvent : SessionEvent = {
            sessionCode, 
            actorUserId: userId, 
            event: 'BUTTON_PRESSED', 
            payload
        }
        this.sendMessage('session-update', sessionEvent);
    }

    endSession(sessionCode: string, hostUserId: number): void {
        const sessionEvent : SessionEvent = {
            sessionCode, 
            actorUserId: hostUserId, 
            event: 'END_REQUEST', 
            payload : {}
        }
        this.sendMessage('session-end', sessionEvent);
    }

}