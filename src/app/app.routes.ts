import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        // canActivate: [authGuard],
        loadComponent: () => 
            import('./layout/layout')
            .then(m => m.Layout),
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/dashboard/dashboard')
                    .then(m => m.Dashboard)
            },
            {
                path: 'users',
                loadComponent: () => 
                    import('./features/users/users')
                    .then(m => m.Users)
            },
            {
                path: 'tenants',
                loadComponent: () => 
                    import('./features/tenants/tenants')
                    .then(m => m.Tenants)
            },
            {
                path: 'settings',
                loadComponent: () => 
                    import('./features/profile-setting/profile-setting')
                    .then(m => m.ProfileSetting)
            }
        ]
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./features/login/login')
            .then(m => m.Login)
    }
];
