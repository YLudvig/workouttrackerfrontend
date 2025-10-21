import { Routes } from '@angular/router';
import { Loginpage } from './loginpage/loginpage';
import { Registerpage } from './registerpage/registerpage';
import { Homepage } from './homepage/homepage';
import { Startpage } from './startpage/startpage';

export const routes: Routes = [
     {
        path: 'login', 
        component: Loginpage, 
        title: 'Login page'
    }, 
    {
        path: 'register',
        component: Registerpage, 
        title: 'Registration site'
    }, 
    {
        path: 'homepage', 
        component: Homepage, 
        title: 'Homepage'
    }, 
    {
        path: '', 
        component: Startpage, 
        title: 'Startpage'
    }
];
