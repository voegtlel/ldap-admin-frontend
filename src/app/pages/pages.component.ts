import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService, AuthService } from '../_services';
import { NbMenuItem } from '@nebular/theme';
import { Subject, combineLatest, Observable } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';

@Component({
    selector: 'ladm-pages-root',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.css'],
})
export class PagesComponent implements OnInit, OnDestroy {
    public menuItems$: Observable<NbMenuItem[]>;
    private destroyed$ = new Subject<void>();

    constructor(public authService: AuthService, public api: ApiService) {
        const initialMenu = [
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

        this.menuItems$ = combineLatest([authService.user$, api.viewConfigSafe$]).pipe(
            map(([user, views]) => {
                if (!user || !views) {
                    return initialMenu;
                }
                return [
                    {
                        title: 'Home',
                        link: '/',
                        icon: 'home',
                    },
                ]
                    .concat(
                        views
                            .filter(view => view.self)
                            .map(view => {
                                return {
                                    title: 'Self',
                                    link: '/edit/' + view.key + '/self',
                                    icon: view.iconClasses,
                                };
                            })
                    )
                    .concat(
                        views
                            .filter(view => view.permissions.some(permission => user[permission]))
                            .map(view => {
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
            }),
            takeUntil(this.destroyed$),
            startWith(initialMenu)
        );
    }

    ngOnInit() {}

    ngOnDestroy() {
        this.destroyed$.next();
    }
}
