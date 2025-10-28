import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/main-page/main-page').then(m => m.MainPage),
        title: 'Home - Repairman.co.il'
    },
    {
        path: 'electrician',
        loadComponent: () => import('./components/electrician-page/electrician-page').then(m => m.ElectricianPage),
        title: 'Electrician Services | Repairman.co.il'
    },
    { path: '**', redirectTo: '' }
];
