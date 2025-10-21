import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { loginUser } from '../api/UserAPI';

@Component({
  selector: 'app-loginpage',
  imports: [RouterLink],
  templateUrl: './loginpage.html',
  styleUrl: './loginpage.css'
})
export class Loginpage {

  // Behöver en konstruktor för router för att kunna göra automatisk redirect vid lyckad inloggning
  constructor(private router:Router) {}

  username: string| null = null;
  password: string| null = null;

  // Booleans som triggar felmeddelanden ifall de är true 
  valuesNotFilled : boolean = false; 
  wrongInfo : boolean = false; 

  // Inloggnignsfunktion, checkar så att värden är ifyllda och kollar sedan om värdena överensstämmer med 
  // backend/db värden innan man antingen blir redirectad till huvudsidan om allt lyckas, annars ges relevant felmeddeladne
  async loginUserFunction(usernameInput: HTMLInputElement, passwordInput: HTMLInputElement): Promise<void> {

    const username = usernameInput.value;
    const password = passwordInput.value;

    if(username != null && username != '' && password != null && password != ''){
      localStorage.removeItem('token');
      const result = await loginUser(username, password);
      if (result?.data.token != null && result?.data.token != '') {
        usernameInput.value = '';
        passwordInput.value = '';
        this.router.navigate(['/homepage']);
      } else {
        this.valuesNotFilled = false;
        this.wrongInfo = true; 
      }
    } else {
      this.wrongInfo = false; 
      this.valuesNotFilled = true; 
    }
  }

}
