import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService, AuthService } from '../_services';
import { NbMenuItem } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ladm-pages-root',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.css'],
})
export class PagesComponent implements OnInit, OnDestroy {
    public menuItems: NbMenuItem[];
    private destroyed$ = new Subject<void>();

    constructor(public authService: AuthService, public api: ApiService) {
        this.menuItems = [
            {
                title: 'Home',
                link: '/',
                icon: 'home',
            },
            {
                title: 'Logout',
                link: '/auth/logout',
                icon: 'log-out',
            },
        ];

        api.viewConfigSafe$.pipe(takeUntil(this.destroyed$)).subscribe(views => {
            this.menuItems = [
                {
                    title: 'Home',
                    link: '/',
                    icon: 'home',
                },
            ]
                .concat(
                    views.map(view => {
                        return {
                            title: view.title,
                            link: '/list/' + view.key,
                            icon: view.iconClasses,
                        };
                    })
                )
                .concat([
                    {
                        title: 'Logout',
                        link: '/auth/logout',
                        icon: 'log-out',
                    },
                ]);
        });
    }

    ngOnInit() {}

    ngOnDestroy() {
        this.destroyed$.next();
    }
}
