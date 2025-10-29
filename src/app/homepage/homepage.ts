import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms'
import { chatBotCall } from '../api/ChatbotAPI';
import { CommonModule } from '@angular/common';
import { createTemplate} from '../api/WorkoutAPI';
import { TemplateService } from '../service/TemplateService';
import { WorkoutTemplate } from '../types/Workoutsession';

@Component({
  selector: 'app-homepage',
  imports: [FormsModule, CommonModule],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage {

  //Tog denna komponenten och översatta den till angular från react/ts: https://www.creative-tim.com/twcomponents/component/chat-box 
  // Boolean som vi användar för att antingen öppna eller stänga vår chat 
  isChatOpen = true; 
  userInput = '';

  // Lista av meddelanden, behöver separera botmeddelanden från promptsen så vi kan bestämma om det ska visas som skickats från en själv eller till en 
  messages: {text: string; from: 'user' | 'bot'} [] = [];

  // Öppnar eller stänger chatten beroende på vilket som var det tidigare läget 
  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage(userInput: HTMLInputElement){
    // Fångar userinputen
    const message = userInput.value.trim();
    // Om userinput ej tom så läggs det till i listan och visas direkt i chatten, input rutan töms och vår metod för att fetcha svar från backenden körs
    if(message){
      this.messages.push({text: message, from: 'user'})
      userInput.value = '';
      this.respondToUser(message);
    }
  }

  // Metod för att hämta svar från backenden för att visa användaren 
  async respondToUser(userMessage: string){
    // Kör våran backend call och lägger sedan till svaret i chatten
    const result = await chatBotCall(userMessage);
    setTimeout(() => {
      this.messages.push({ text: result.data, from: 'bot'})
    });    
  }

 
  // Sätter defaultvärden för det som sedan kommer skickas in för att skapa templates 
  userId = localStorage.getItem('user');
  templateName = '';
  // Denna nedan gör så att det automatiskt finns en rad i varje workouttemplate
  exercises = [
    {exerciseName: '', weight: 0, completed: false}
  ]

  templateErrorMsg = ''; 


  // Metod för att lägga till en övning i träningspasstemplatet 
  addExercise() {
    this.exercises.push({exerciseName: '', weight: 0, completed: false})
  }

  // Metod för att ta bort en övning 
  removeExercise(index: number){
    if(this.exercises.length != 1){
      this.exercises.splice(index, 1);
    }
  }

  // Metod för att skicka iväg template till backend och skapa i databasen 
  async submitTemplate(){
    this.templateErrorMsg = '';

    // Felhantering ifall man inte fyllt i namn för träningspasset 
    if (!this.templateName.trim()){
      this.templateErrorMsg = 'Du har inte anget namn för ditt träningspass'
      return; 
    }

    // Felhantering för ifall några av övningarna inte är korrekt ifyllda 
    const invalid = this.exercises.some(
      (ex) => ! ex.exerciseName.trim() || ex.weight <= 0
    ); 
    if (invalid){
      this.templateErrorMsg = 'Vissa av övningarna var inte korrekt ifyllda, kontroller igen'
      return; 
    }

    const workoutTemplate = {
      userId : this.userId ? Number(this.userId) : 1, 
      templateName: this.templateName, 
      exercises: this.exercises
    };

    try {
      // Submittar och sedan så nollställs inputs så att man fritt kan skapa andra träningspass
      const response = await createTemplate(workoutTemplate);
      console.log(response);
      alert('Ditt träningspass skapades');
      this.templateName = ''; 
      this.exercises = [{exerciseName: '', weight: 0, completed: false}]; 
    } catch (err){
      console.error(err);
    }

  }

  constructor(private templateService: TemplateService) {};

  templateList: WorkoutTemplate[] = [];

  // Hämtar lista över användarens träningspass när de går in på sidan/loggar in 
  async ngOnInit(){
    this.templateList = await this.templateService.fetchTemplates();
    console.log(this.templateList);
  }


}
