import { Component } from '@angular/core';
import { buyStripeItem } from '../api/StripeAPI';
@Component({
  selector: 'app-webbshop',
  imports: [],
  templateUrl: './webbshop.html',
  styleUrl: './webbshop.css'
})
export class Webbshop {

  // Kallar på backenden där all logien sköts för att köpa en stripeProdukt 
  async stripePurchase(priceId: string){
    const response = await buyStripeItem(priceId);
  }

}
