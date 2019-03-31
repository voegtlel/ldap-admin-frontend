import {HttpClient} from '@angular/common/http';

import {BehaviorSubject, EMPTY, Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {first, map, switchMap} from 'rxjs/operators';
import {ViewListValue, Views, ViewDetailValue, ViewValueAssignment, AuthUserModel} from '../_models';
import {NbAuthService} from '@nebular/auth';


@Injectable({
    providedIn: 'root'
})
export class ApiService {
    public readonly viewConfig$: BehaviorSubject<Views> = new BehaviorSubject(null);
    public readonly viewConfigSafe$: Observable<Views>;

    constructor(private http: HttpClient, private authService: NbAuthService) {
        authService.isAuthenticated().subscribe((user) => console.log('User:', user));
        authService.getToken().subscribe((token) => console.log('Token:', token));

        authService.isAuthenticated().pipe(
            switchMap(
                (isAuthenticated) => isAuthenticated ? http.get<Views>(`${environment.apiUrl}/config/`).pipe(first()) : of(null)
            )
        ).subscribe((config) => {
            if ((this.viewConfig$.value === null) !== (config === null)) {
                this.viewConfig$.next(config);
            }
        });

        this.viewConfigSafe$ = this.viewConfig$.pipe(
            switchMap(
                (config) => (config !== null) ? of(config) : EMPTY
            )
        );

        this.viewConfig$.subscribe((config) => console.log('API config:', config));
        this.viewConfigSafe$.subscribe((config) => console.log('Safe API config:', config));
    }

    createView(view: string, assignments: ViewValueAssignment): Observable<null> {
        return this.http.post<null>(`${environment.apiUrl}/${view}/`, assignments);
    }

    getViewList(view: string): Observable<ViewListValue> {
        return this.http.get<ViewListValue>(`${environment.apiUrl}/${view}/`).pipe(map(x => {
            console.log(`GET ${environment.apiUrl}/${view}/`);
            return x;
        }));
    }

    getView(view: string, primaryKey: string): Observable<ViewDetailValue> {
        return this.http.get<ViewDetailValue>(`${environment.apiUrl}/${view}/${primaryKey}/`);
    }

    updateView(view: string, primaryKey: string, assignments: ViewValueAssignment): Observable<null> {
        return this.http.patch<null>(`${environment.apiUrl}/${view}/${primaryKey}/`, assignments);
    }

    deleteView(view: string, primaryKey: string): Observable<null> {
        return this.http.delete<null>(`${environment.apiUrl}/${view}/${primaryKey}/`);
    }

    getAuthSelf(): Observable<AuthUserModel> {
        return this.http.get<AuthUserModel>(`${environment.apiUrl}/auth/`);
    }
}
