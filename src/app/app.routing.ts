import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './pages/home/home.component';
import {AuthGuard} from './_guards';
import {NbAuthComponent, NbLogoutComponent} from '@nebular/auth';
import {PagesComponent} from './pages/pages.component';
import {LoginComponent} from './auth/login/login.component';
import {ViewEditComponent} from './pages/viewEdit/viewEdit.component';
import {ViewListComponent} from './pages/viewList/viewList.component';


const appRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: PagesComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
            },
            {
                path: 'list/:view',
                component: ViewListComponent,
            },
            {
                path: 'edit/:view/:primaryKey',
                component: ViewEditComponent,
            },
            {
                path: 'edit/:view',
                component: ViewEditComponent,
            },
        ]
    },

    {
        path: 'auth',
        component: NbAuthComponent,
        children: [
            {
                path: '',
                component: LoginComponent,
            },
            {
                path: 'login',
                component: LoginComponent,
            },
            /*{
                path: 'register',
                component: NbRegisterComponent,
            },*/
            {
                path: 'logout',
                component: NbLogoutComponent,
            },
            /*{
                path: 'request-password',
                component: NbRequestPasswordComponent,
            },
            {
                path: 'reset-password',
                component: NbResetPasswordComponent,
            },*/
        ],
    },

    // otherwise redirect to home
    {
        path: '**',
        redirectTo: ''
    }
];

export const routing = RouterModule.forRoot(appRoutes);
