import { Component } from '@angular/core';
import { WorkoutWS } from '../websocket';
import { WorkoutSession } from '../types/Workoutsession';

@Component({
  selector: 'app-workout',
  imports: [],
  templateUrl: './workout.html',
  styleUrl: './workout.css'
})
export class Workout {

  // Session
  session : WorkoutSession | null = null; 

  constructor(private wsService: WorkoutWS) {};

  // När går in på sidan subscribear till WS
  ngOnInit(){
    this.wsService.connect((frame) => {

      console.log("Client STOMP session id", this.wsService.client);
      console.log(frame);

      this.wsService.client.subscribe('/user/queue/session-started', (msg) => {
        const data = JSON.parse(msg.body);
        console.log('SessionId', data.sessionId);
        console.log(data);

        if (data.sessionData){
          this.session = data.sessionData; 
          this.wsService.sessionUpdates.next(data.sessionData);
        }
  
        this.wsService.subscribeToSession(data.sessionId);
      });
      // Sätter sessionsinfo 
      this.wsService.sessionUpdates.subscribe(sessionData => {
        if (sessionData) { 
          console.log('Träningspass uppdatering: ', sessionData); 
          this.session = sessionData; 
        } else {
          console.log("Ingen sessionsdata mottagen")
        }
      });
    });
  }

  startSession(){
    const payload = {
      userId: localStorage.getItem('userId'), 
      templateId: 4
    }; 
    this.wsService.sendMessage('/app/session/start', payload);
  }

}
