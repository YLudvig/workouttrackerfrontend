import { Component } from '@angular/core';
import { WorkoutWS } from '../websocket';

@Component({
  selector: 'app-workout',
  imports: [],
  templateUrl: './workout.html',
  styleUrl: './workout.css'
})
export class Workout {

  constructor(private wsService: WorkoutWS) {};

  ngOnInit(){
    this.wsService.connect((frame) => {
      this.wsService.client.subscribe("/user/queue/session-started", (msg) => {
        const data = JSON.parse(msg.body);
        console.log('SessionId', data.sessionId);
  
        this.wsService.subscribeToSession(data.sessionId);
      })
      this.wsService.sessionUpdates.subscribe(data => {
        if (data) console.log('Workout session update:', data);
      })
    });

  }

  startSession(){
    const payload = {
      userId: localStorage.getItem('userId'), 
      templateId: 4
    }; 
    this.wsService.sendMessage('/app/session/start', payload);
    console.log(localStorage.getItem('userId'));
    console.log("start session")
    console.log(payload);
  }

}
