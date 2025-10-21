import { environment } from "../../environments/environment";

const token = localStorage.getItem("token");

// Exporterar vår funktion för att skicka prompts till chatbotten 
export async function chatBotCall(prompt:string): Promise<{data: string}> {
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