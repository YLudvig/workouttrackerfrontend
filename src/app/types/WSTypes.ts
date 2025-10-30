// Gör typer för att motsvara backend typningar 

export interface CreateSessionRequest{
    hostUserId: number; 
    workoutId?: number; 
}

export interface CreateSessionResponse {
    sessionId: string; 
    sessionCode: string; 
}

export interface JoinSessionRequest{
    sessionCode: string; 
    userId: number; 
}

export interface SessionEvent {
    sessionCode: string; 
    actorUserId?: number; 
    event?: string; 
    payload?: SessionPayload; 
}

export interface SessionPayload{
    sessionState?: string; 
    participants?: number[]; 
    [key: string]: any; 
}