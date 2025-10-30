
// Skapar typoer som motsvarar vad backend skickar för att typsäkra frontenden mer 
export interface Exercise {
    exerciseId: number; 
    exerciseName: string; 
    weight: number; 
    completed: boolean; 
}

export interface WorkoutSession {
    sessionCode: string; 
    workoutId?: number; 
    workoutName?: string; 
    exercises: Exercise[];
    participantsIds: number[];
    workout?: Workout | null; 
    sessionState?: string; 
}

export interface Workout {
    workoutId: number; 
    userId : number; 
    workoutName: string; 
    completed: boolean; 
    completedAt: string | null; 
}

export interface WorkoutList {
    exercises : Exercise[]; 
    workout: Workout; 
}

export interface WorkoutRequest {
    userId: number; 
    workoutName: string; 
    completed: boolean; 
    exercises: ExerciseRequest[];
}

export interface ExerciseRequest {
    exerciseName: string; 
    weight: number; 
    completed: boolean; 
}