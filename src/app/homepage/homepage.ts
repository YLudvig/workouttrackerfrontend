import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { chatBotCall } from '../api/ChatbotAPI';
import { CommonModule } from '@angular/common';
import { createWorkout } from '../api/WorkoutAPI';
import { WorkoutService } from '../service/WorkoutService';
import { WorkoutList, WorkoutRequest } from '../types/Workoutsession';

@Component({
  selector: 'app-homepage',
  imports: [FormsModule, CommonModule],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage implements OnInit{
  //Tog denna komponenten och översatta den till angular från react/ts: https://www.creative-tim.com/twcomponents/component/chat-box
  // Boolean som vi användar för att antingen öppna eller stänga vår chat
  isChatOpen = true;
  userInput = '';

  // Lista av meddelanden, behöver separera botmeddelanden från promptsen så vi kan bestämma om det ska visas som skickats från en själv eller till en
  messages: { text: string; from: 'user' | 'bot' }[] = [];

  // Öppnar eller stänger chatten beroende på vilket som var det tidigare läget
  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage(userInput: HTMLInputElement) {
    // Fångar userinputen
    const message = userInput.value.trim();
    // Om userinput ej tom så läggs det till i listan och visas direkt i chatten, input rutan töms och vår metod för att fetcha svar från backenden körs
    if (message) {
      this.messages.push({ text: message, from: 'user' });
      userInput.value = '';
      this.respondToUser(message);
    }
  }

  // Metod för att hämta svar från backenden för att visa användaren
  async respondToUser(userMessage: string) {
    // Kör våran backend call och lägger sedan till svaret i chatten
    const result = await chatBotCall(userMessage);
    setTimeout(() => {
      this.messages.push({ text: result.data, from: 'bot' });
    });
  }

  // Sätter defaultvärden för det som sedan kommer skickas in för att skapa workouts
  userId = localStorage.getItem('user');
  workoutName = '';
  // Denna nedan gör så att det automatiskt finns en rad i varje workout
  exercises = [{ exerciseName: '', weight: 0, completed: false }];

  workoutErrorMsg = '';

  // Metod för att lägga till en övning i träningspasstemplatet
  addExercise() {
    this.exercises.push({ exerciseName: '', weight: 0, completed: false });
  }

  // Metod för att ta bort en övning
  removeExercise(index: number) {
    if (this.exercises.length != 1) {
      this.exercises.splice(index, 1);
    }
  }

  // Metod för att skicka iväg workout till backend och skapa i databasen
  async submitWorkout() {
    this.workoutErrorMsg = '';

    // Felhantering ifall man inte fyllt i namn för träningspasset
    if (!this.workoutName.trim()) {
      this.workoutErrorMsg = 'Du har inte anget namn för ditt träningspass';
      return;
    }

    // Felhantering för ifall några av övningarna inte är korrekt ifyllda
    const invalid = this.exercises.some((ex) => !ex.exerciseName.trim() || ex.weight <= 0);
    if (invalid) {
      this.workoutErrorMsg = 'Vissa av övningarna var inte korrekt ifyllda, kontroller igen';
      return;
    }

    const workoutToSend: WorkoutRequest = {
      userId: this.userId ? Number(this.userId) : 1,
      workoutName: this.workoutName,
      completed: false, 
      exercises: this.exercises,
    };

    try {
      // Submittar och sedan så nollställs inputs så att man fritt kan skapa andra träningspass
      await createWorkout(workoutToSend);


      // Pushar lokalt för att undvika att behöva refetcha då det skapade desync problem, nu så skickas den till backend samtidigt som den läggs till på lokal listan därmed så 
      // uppdateras det omedelbart utan att behöva refetcha, refetches sker senare naturligt och overridear då med den riktiga datan över den
      this.workoutList.push({
        workout: {
          workoutId: 0,
          workoutName: this.workoutName,
          userId: Number(this.userId),  
          completed: false, 
          completedAt: "fake"}, 
        exercises: this.exercises.map(ex => ({
          exerciseId: 0, 
          exerciseName: ex.exerciseName, 
          weight: ex.weight, 
          completed: ex.completed
      }))
      })

      console.log(this.workoutList);

      this.workoutName = '';
      this.exercises = [{ exerciseName: '', weight: 0, completed: false }];
      alert('Ditt träningspass skapades');
    } catch (err) {
      console.error(err);
    }
  }

  constructor(private workoutService: WorkoutService) {}

  workoutList: WorkoutList[] = [];

  // Boolean för om man laddar, med denna så kan vi conditionally rendera saker så att vi inte får problem med desync mellan routing och fetchhastighet 
  isLoading = true; 

  // Hämtar lista över användarens träningspass när de går in på sidan/loggar in
  // Behöver felhantering så att det inte blir problem med att routing är snabbare än vad fetches är 
  async ngOnInit() {
    try {
      this.workoutList = await this.workoutService.fetchWorkouts();
      console.log(this.workoutList);
    } catch (err){
      console.error('Fetch misslyckades', err);
    } finally {
      this.isLoading = false; 
    }
  }

  tableIndex: number | null = null;

  // Toggle så att användaren kan visa mer om ett träningspass eller visa mindre
  toggleTable(index: number) {
    this.tableIndex = this.tableIndex === index ? null : index;
  }
}
