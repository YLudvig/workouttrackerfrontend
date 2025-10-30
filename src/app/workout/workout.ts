import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { WorkoutWS } from '../websocket';
import { Exercise, WorkoutList, WorkoutSession } from '../types/Workoutsession';
import { WorkoutService } from '../service/WorkoutService';
import { FormsModule } from '@angular/forms';
import { CreateSessionRequest, JoinSessionRequest, SessionEvent } from '../types/WSTypes';


@Component({
  selector: 'app-workout',
  imports: [FormsModule],
  templateUrl: './workout.html',
  styleUrl: './workout.css',
})
export class Workout implements OnInit, OnDestroy{

  // Tar in våra metoder 
  private ws = new WorkoutWS();

  constructor(private workoutService: WorkoutService, private zone: NgZone) {}

  // Sessionskoden som genereras när dus kapar en session, host ivsar denna för folk så att de kanjoin a
  createdSessionCode = ''; 

  // Tom input för inputfieldet för att joina lobbyn 
  joinCode = ''; 
  
  // Håller koll på nuvarande sessionen 
  currentSessionCode: string | null = null; 

  // Lista över feedback meddelanden
  messages: string[] = []; 


  workoutList : WorkoutList [] = [];

  // Session
  session: WorkoutSession | null = null;
 
  // Trackar vilket träningspass som är valt för att 
  selectedWorkoutId: number | undefined = undefined; 

  // När går in på sidan subscribear till WS
  async ngOnInit() {
    this.workoutList = await this.workoutService.getWorkoutList();
    this.ws.connect();
  }

  // Körs när man lämnar sidan 
  ngOnDestroy() {
    if (this.currentSessionCode) {
      this.ws.unsubscribe(this.currentSessionCode);
    }
    this.ws.disconnect();
  }


  // Metod för att skapa en session och sedan kopplas man till den skapade sessionen 
  onCreateSession(): void{
    const request: CreateSessionRequest = {hostUserId: Number(localStorage.getItem('userId')), workoutId: this.selectedWorkoutId}; 

    this.ws.createSession(request);
    this.addMessage('Försöker skapa session');

    // Behöver interagera med ngZone för att få en uppdatering att ske när vi har info om sessionskoden 
    this.ws['client']?.subscribe('/user/queue/create-response', (message: any) => {
      const response = JSON.parse(message.body); 

      this.zone.run(() => {
        this.createdSessionCode = response.sessionCode; 
        this.currentSessionCode = response.sessionCode;
        this.addMessage(`Session skapad med koden: ${response.sessionCode}`); 
      })

      this.ws.subscribeToSession(response.sessionCode, (e) => this.handleEvent(e));
    })

  }

  // Metod för att joina en session om du har deras sessionskod 
  onJoin(): void{
    if (!this.joinCode){
      this.addMessage('Ej ifylld sessionskod'); 
      return; 
    }

    const request : JoinSessionRequest = { sessionCode: this.joinCode.trim(), userId: Number(localStorage.getItem('userId'))};
    this.ws.joinSession(request);

    // Om man var i en session redan så tas man bort från den så man kan joina en annan 
    if (this.currentSessionCode){
      this.ws.unsubscribe(this.currentSessionCode)
    };

    // Subscribear till en session och nollställer inputen för sessionskod att joina 
    this.currentSessionCode = request.sessionCode; 
    this.ws.subscribeToSession(request.sessionCode, (sessionEvent: SessionEvent) => this.handleEvent(sessionEvent)); 
    this.joinCode = ''; 
    this.addMessage(`Sessionen du är subscribad till: ${request.sessionCode}`)
  }


  // Skickar signal till backend att starta sessionen
  onStartSession() {
    const code = this.createdSessionCode || this.currentSessionCode; 
    if (!code){
      this.addMessage('Finns ingen session att starta'); 
      return; 
    }

    this.ws.startSession(code, Number(localStorage.getItem('userId'))); 
    this.addMessage(`Försöker starta sessionen ${code}`);
  }


  // Skickar signal till backend för att avsluta sessionen 
  onEndSession(): void {
    const code = this.createdSessionCode || this.currentSessionCode; 
    if (!code){
      this.addMessage('Kan inte avsluta session då du inte är i en session');
      return; 
    }
    this.ws.endSession(code, Number(localStorage.getItem('userId')))
    this.addMessage('Avsluta session'); 
  }

  // Metod för att ge relevant feedback 
  private addMessage(text: string): void{
    this.messages.unshift(`${new Date().toLocaleTimeString()}: ${text}`); 
    if (this.messages.length > 100) this.messages.pop(); 
  }

  // Metod som hanterar all information som kommer från backend och renderar beroende på type 
  private handleEvent(sessionEvent : SessionEvent): void {
    const type = sessionEvent.event || 'UNKNOWN'; 
    const actor = sessionEvent.actorUserId ?? 'unknwon actor'; 
    const sessionState = sessionEvent.payload?.sessionState ?? ''; 
    const payload = sessionEvent.payload || {}; 

    const participants : number[] = Array.isArray(payload?.participants) ? payload!.participants: []; 
    const exercises : Exercise[] = Array.isArray(payload.exercises) ? payload.exercises : [];
    const workout = payload.workout || null; 

    this.addMessage(`[${type}] actor:${actor} state:${sessionState} participants:${participants}`); 
    
    if (!this.session) this.session = { sessionCode : sessionEvent.sessionCode, participantsIds : participants, exercises, workout, sessionState}; 

    this.session!.participantsIds = participants; 
    this.session!.exercises = exercises; 
    this.session!.workout = workout; 
    this.session!.sessionState = sessionState;


    if (type === 'SESSION_CREATED' && actor === Number(localStorage.getItem('userId'))){
      this.createdSessionCode = sessionEvent.sessionCode; 
      this.addMessage(`Skapde session med sessionskod: ${sessionEvent.sessionCode}`); 

      // Säkerställer att host är subscribad till topic 
      if (!this.currentSessionCode) {
        this.currentSessionCode = sessionEvent.sessionCode; 
        this.currentSessionCode = sessionEvent.sessionCode;
        this.ws.subscribeToSession(sessionEvent.sessionCode, (e) => this.handleEvent(e));
      }
    }

    if (type === 'SESSION_SYNC') {
      this.addMessage(`[${type}] synkade deltagare: ${participants}`)
    }

    if (type === 'SESSION_ENDED') {
      if (this.currentSessionCode){
        this.ws.unsubscribe(this.currentSessionCode);
        this.currentSessionCode = null; 
      }
      this.addMessage('Session avslutad, unsubscribear från topic');
    }

  }

  // Metod för att markera övning som färdig, denna är central för hur websocket fungerar i denna appen och kommer att förbättras med funktonalitet så att man måste klicka på klar lika många gånger som det är deltagare 
  markExerciseCompleted(exerciseId: number){
    // Felhantering för fall där du på något sätt försöker åkalla detta utan att vara i en session 
    if (!this.currentSessionCode){
      this.addMessage('Du är inte i en session');
      return; 
    }

    this.ws.sendUpdate(this.currentSessionCode, Number(localStorage.getItem('userId')), {exerciseId}); 
    this.addMessage(`Övning ${exerciseId} markerad som klar`); 
  }

}
