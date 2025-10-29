import { Injectable } from "@angular/core";
import { getAllTemplates } from "../api/WorkoutAPI";
import { WorkoutTemplate } from "../types/Workoutsession";

@Injectable({providedIn: 'root'})
export class TemplateService{
    // Lista över användarens templates 
    private templateList: WorkoutTemplate[] = [];

    private userId = localStorage.getItem('userId');

    async fetchTemplates(): Promise<WorkoutTemplate[]>{
        if (this.templateList.length === 0 && this.userId){
            const response =  await getAllTemplates(Number(this.userId));
            this.templateList = response;
        }
        return this.templateList;
    }

    getTemplateList(){
        return this.templateList;
    }

}