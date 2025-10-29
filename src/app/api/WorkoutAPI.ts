import { environment } from "../../environments/environment";
import { WorkoutList, WorkoutRequest } from "../types/Workoutsession";

const token = localStorage.getItem("token");


// Exporterar vår funktion för att skapa workout
export async function createWorkout(workout: WorkoutRequest): Promise<{data: string}> {
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