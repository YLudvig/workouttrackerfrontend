import { environment } from "../../environments/environment";
import { WorkoutList, WorkoutRequest } from "../types/Workoutsession";



// Exporterar vår funktion för att skapa workout
export async function createWorkout(workout: WorkoutRequest): Promise<{data: string}> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${environment.backendApiUrl}/workout/createWorkout`, {
        method : "POST", 
        headers: {
            "Content-Type": "application/json", 
            'Authorization': `Bearer ${token}`
        }, 
        body: JSON.stringify(workout)
    });
    const data = await response.text();
    return {data};
}

// Exporterar vår funktion för att hämta workouts
export async function getAllWorkouts(userId : number): Promise<WorkoutList[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${environment.backendApiUrl}/workout/getUsersWorkouts?userId=${userId}`, {
        method : "GET", 
        headers: {
            "Content-Type": "application/json", 
            'Authorization': `Bearer ${token}`
        }, 
    });
    const result =  await response.json();
    console.log(result);
    return result; 
}