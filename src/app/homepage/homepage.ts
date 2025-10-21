import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import {FormsModule} from '@angular/forms'
import { chatBotCall } from '../api/ChatbotAPI';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage',
  imports: [RouterLink, FormsModule, CommonModule],
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

 

}
