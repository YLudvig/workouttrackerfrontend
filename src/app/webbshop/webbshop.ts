import { Component } from '@angular/core';
import { buyStripeItem } from '../api/StripeAPI';
@Component({
  selector: 'app-webbshop',
  imports: [],
  templateUrl: './webbshop.html',
  styleUrl: './webbshop.css'
})
export class Webbshop {

  async stripePurchase(priceId: string){
    const response = await buyStripeItem(priceId);
    console.log(response);
  }

}
