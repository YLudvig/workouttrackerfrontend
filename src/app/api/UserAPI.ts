import { environment } from "../../environments/environment";



// Exporterar vår funktion för att logga in användare 
export async function loginUser(username: string, password: string): Promise<{data: any}> {
    // Backend nyttja RequestParam behöver därför skicka i form av encodeURIComponents 
    const response = await fetch(`${environment.backendApiUrl}/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
        method : "POST", 
        headers: {
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify({username, password})
    })
    const data = await response.json();
    localStorage.removeItem('token');
    if(data.token != null && data.token != ''){
        localStorage.setItem('token', data.token);
    }
    return {data};
}