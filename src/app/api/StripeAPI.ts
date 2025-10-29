import { environment } from "../../environments/environment";

const token = localStorage.getItem("token");
const userId = localStorage.getItem('userId');

// Exporterar vår funktion för att skicka användare till stripe för att köpa ösnakde program
export async function buyStripeItem(priceId:string): Promise<any> {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem('userId');
    const response = await fetch(`${environment.backendApiUrl}/stripe/create-checkout-session`, {
        method : "POST", 
        headers: {
            "Content-Type": "application/json", 
            'Authorization': `Bearer ${token}`
        }, 
        body: JSON.stringify(
            {
                priceId : priceId, 
                userId: userId
            }
        )
    });

    // Om väntad respons status så körs dessa if satser, om allt ser rätt ut så redirectas användaren till Stripe annars ges reelvant felmeddelande
    if(response.ok){
        const data = await response.json(); 
        const redirectUrl = data.url;
        // Detta redirectar användaren till Stripe om det finns en redirecturl i backend responsen 
        if (redirectUrl) {
            window.location.href = redirectUrl;
        // Om ingen redirect URL så försöker vi inte redirecta för att inte skapa problem
        } else {
            alert("Fann ej URL att redirecta till.");
        } 
    } else {
        alert("Misslyckades att redirecta")
    }
}