import { Component, NgZone } from '@angular/core';
import { WorkoutWS } from '../websocket';
import { WorkoutSession } from '../types/Workoutsession';

@Component({
  selector: 'app-workout',
  imports: [],
  templateUrl: './workout.html',
  styleUrl: './workout.css'
})
export class Workout {

  // Trackar connceted så man inte kan göra requests innan det då det pajar flödet
  connected = false; 

  // Session
  session : WorkoutSession | null = null; 

  constructor(private wsService: WorkoutWS, private ngZone: NgZone) {};

  // När går in på sidan subscribear till WS
  ngOnInit(){

    this.wsService.connect((frame) => {

      console.log("Client STOMP session id", this.wsService.client);
      console.log(frame);
      this.connected = true; 

      this.wsService.client.subscribe('/user/queue/session-started', (msg) => {
        const data = JSON.parse(msg.body);
        console.log('SessionId', data.sessionId);
        console.log(data);

        if (data.sessionData){
          this.ngZone.run(() => {
            this.session = data.sessionData; 
          })
          this.wsService.sessionUpdates.next(data.sessionData);
        }
  
        this.wsService.subscribeToSession(data.sessionId);
      });
      // Sätter sessionsinfo 
      this.wsService.sessionUpdates.subscribe(sessionData => {
        if (sessionData) { 
          this.ngZone.run(() => {
            console.log('Träningspass uppdatering: ', sessionData); 
            this.session = sessionData; 
          })
        } else {
          console.log("Ingen sessionsdata mottagen")
        }
      });
    });
  }

  startSession(){
    if (!this.connected){
      console.log('Websocket ej redo!');
      return; 
    }
    const payload = {
      userId: localStorage.getItem('userId'), 
      templateId: 12
    }; 
    this.wsService.sendMessage('/app/session/start', payload);
  }

  ngOnDestroy() {
    this.wsService.disconnect();
  }

}
