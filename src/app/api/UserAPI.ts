import { environment } from "../../environments/environment";


// Exporterar vår funktion för att registrera användare 
export async function registerUser(username:string, email: string, password: string): Promise<{data: any}> {
    // Backend nyttja RequestParam behöver därför skicka i form av encodeURIComponents 
    const response = await fetch(`${environment.backendApiUrl}/auth/register?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
        method : "POST", 
        headers: {
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify({username, email, password})
    });
    const data = await response.json();
    return {data};
}



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
    localStorage.removeItem('username');
    localStorage.removeItem('userid');
    if(data.token != null && data.token != ''&& data.username != null && data.username != ''){
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userId', data.userId);
    }
    return {data};
}