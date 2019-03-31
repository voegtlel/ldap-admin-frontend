import {Component, OnInit} from '@angular/core';
import {ApiService, AuthService} from '../_services';
import {NbMenuItem} from '@nebular/theme';

@Component({
    selector: 'pages-root',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
    public menuItems: NbMenuItem[];

    constructor(
        private authService: AuthService,
        public api: ApiService,
    ) {
        this.menuItems = [
            {
                title: 'Home',
                link: '/',
                icon: 'fa fa-th'
            },
            {
                title: 'Logout',
                link: '/auth/logout',
                icon: 'fa fa-sign-out'
            }
        ];

        api.viewConfigSafe$.subscribe((views) => {
            this.menuItems = [
                {
                    title: 'Home',
                    link: '/',
                    icon: 'fa fa-th'
                }
            ].concat(views.map((view) => {
                return {
                    title: view.title,
                    link: '/list/' + view.key,
                    icon: view.iconClasses
                };
            })).concat([
                {
                    title: 'Logout',
                    link: '/auth/logout',
                    icon: 'fa fa-sign-out'
                }
            ]);
        });
    }

    ngOnInit() {
    }
}
