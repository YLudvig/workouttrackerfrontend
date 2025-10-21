import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  currentRoute: string ='';


  constructor(private router: Router){
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    })
  }

}
