import { environment } from "../../environments/environment";

const token = localStorage.getItem("token");

// Exporterar vår funktion för att registrera användare 
export async function chatBotCall(prompt:string): Promise<{data: string}> {
    // Backend nyttja RequestParam behöver därför skicka i form av encodeURIComponents 
    const response = await fetch(`${environment.backendApiUrl}/workouttracker/chat`, {
        method : "POST", 
        headers: {
            "Content-Type": "application/json", 
            'Authorization': `Bearer ${token}`
        }, 
        body: JSON.stringify({prompt})
    });
    const data = await response.text();
    return {data};
}