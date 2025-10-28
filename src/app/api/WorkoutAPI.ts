import { environment } from "../../environments/environment";
import { WorkoutTemplate } from "../types/Workoutsession";

const token = localStorage.getItem("token");


// Exporterar vår funktion för att skapa workouttemplate 
export async function createTemplate(workoutTemplate: WorkoutTemplate): Promise<{data: string}> {
    const response = await fetch(`${environment.backendApiUrl}/template/createTemplate`, {
        method : "POST", 
        headers: {
            "Content-Type": "application/json", 
            'Authorization': `Bearer ${token}`
        }, 
        body: JSON.stringify({workoutTemplate})
    });
    const data = await response.text();
    return {data};
}