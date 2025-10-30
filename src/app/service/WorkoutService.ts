import { Injectable } from "@angular/core";
import { getAllWorkouts } from "../api/WorkoutAPI";
import { WorkoutList } from "../types/Workoutsession";

@Injectable({providedIn: 'root'})
export class WorkoutService{
    // Lista över användarens templates 
    private workoutList: WorkoutList[] = [];

    private userId = localStorage.getItem('userId');

    async fetchWorkouts(): Promise<WorkoutList[]>{
        if (this.userId){
            const response =  await getAllWorkouts(Number(this.userId));
            this.workoutList = response;
        }
        return this.workoutList;
    }

    getWorkoutList(){
        return this.workoutList;
    }

}