
// Skapar typoer som motsvarar vad backend skickar för att typsäkra frontenden mer 
export interface Exercise {
    exerciseName: string; 
    weight: number; 
    completed: boolean; 
}

export interface WorkoutSession {
    sessionId: string; 
    templateId: number; 
    templateName: string; 
    exercises: Exercise[];
    participantsIds: number[];
}

export interface WorkoutTemplate {
    workoutTemplateId?: number; 
    userId : number; 
    templateName: string; 
    exercises: Exercise[];
}