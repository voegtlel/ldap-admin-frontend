import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, switchMap, shareReplay } from 'rxjs/operators';
import { ViewListValue, Views, ViewDetailValue, ViewValueAssignment, AuthUserModel } from '../_models';
import { NbAuthService, NbTokenService, NbAuthJWTToken } from '@nebular/auth';
import { EnvService } from './env.service';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    public readonly viewConfig$: BehaviorSubject<Views> = new BehaviorSubject(null);
    public readonly viewConfigSafe$: Observable<Views>;

    constructor(
        private http: HttpClient,
        authService: NbAuthService,
        private env: EnvService,
        private tokenService: NbTokenService
    ) {
        authService
            .onAuthenticationChange()
            .pipe(
                switchMap((isAuthenticated) =>
                    isAuthenticated ? http.get<Views>(`${env.apiUrl}/config`).pipe(shareReplay(1)) : of(null)
                )
            )
            .subscribe((config) => {
                if ((this.viewConfig$.value === null) !== (config === null)) {
                    this.viewConfig$.next(config);
                }
            });

        this.viewConfigSafe$ = this.viewConfig$.pipe(switchMap((config) => (config !== null ? of(config) : EMPTY)));

        // this.viewConfig$.subscribe((config) => console.log('API config:', config));
        // this.viewConfigSafe$.subscribe((config) => console.log('Safe API config:', config));
    }

    createView(view: string, assignments: ViewValueAssignment): Observable<null> {
        return this.http.post<null>(`${this.env.apiUrl}/${view}`, assignments);
    }

    getViewList(view: string): Observable<ViewListValue> {
        return this.http.get<ViewListValue>(`${this.env.apiUrl}/${view}`).pipe(
            map((x) => {
                console.log(`GET ${this.env.apiUrl}/${view}`);
                return x;
            })
        );
    }

    getView(view: string, primaryKey: string): Observable<ViewDetailValue> {
        return this.http.get<ViewDetailValue>(`${this.env.apiUrl}/${view}/${primaryKey}`);
    }

    updateView(view: string, primaryKey: string, assignments: ViewValueAssignment): Observable<null> {
        return this.http
            .patch<{ token: string }>(`${this.env.apiUrl}/${view}/${primaryKey}`, assignments)
            .pipe(
                switchMap((tokenData) =>
                    tokenData ? this.tokenService.set(new NbAuthJWTToken(tokenData.token, 'email')) : of(null)
                )
            );
    }

    deleteView(view: string, primaryKey: string): Observable<null> {
        return this.http.delete<null>(`${this.env.apiUrl}/${view}/${primaryKey}`);
    }

    getAuthSelf(): Observable<AuthUserModel> {
        return this.http.get<AuthUserModel>(`${this.env.apiUrl}/auth`);
    }
}
