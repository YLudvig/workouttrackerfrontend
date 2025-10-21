import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { registerUser } from '../api/UserAPI';

@Component({
  selector: 'app-registerpage',
  imports: [RouterLink],
  templateUrl: './registerpage.html',
  styleUrl: './registerpage.css'
})
export class Registerpage {
   // Booleans för att rendera relevant feedback för användaren 
  valuesNotFilled : boolean = false;
  emailInUse : boolean = false; 
  successfulRegistration : boolean = false; 

  async registerUserFunction(usernameInput: HTMLInputElement, emailInput: HTMLInputElement, passwordInput: HTMLInputElement): Promise<void>{

    const username = usernameInput.value; 
    const email = emailInput.value;
    const password = passwordInput.value;

    // Gör logik check så att username, email och password angets och annars ger man feedback
    if(username != null && username != '' && email != null && email != '' && password != null && password != ''){
      // Behöver få info om vad responsen var 
      const result = await registerUser(username, email, password);
      if (result.data.status === 'Misslyckades'){
        this.successfulRegistration = false;
        this.valuesNotFilled = false; 
        this.emailInUse = true; 
      } else {
        this.emailInUse = false; 
        this.valuesNotFilled = false; 
        this.successfulRegistration = true;
        // Nollställer värdena efter lyckad registrering 
        usernameInput.value = '';
        emailInput.value = '';
        passwordInput.value = '';
      }
    } else {
      this.emailInUse = false; 
      this.successfulRegistration = false; 
      this.valuesNotFilled = true; 
    }
  };
  
}
