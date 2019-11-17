import { Injectable } from '@angular/core';
import { switchMap, shareReplay, tap } from 'rxjs/operators';
import { AuthUserModel } from '../_models';
import { ApiService } from './api.service';
import { NbAuthService } from '@nebular/auth';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public user$: Observable<AuthUserModel>;

    constructor(api: ApiService, authService: NbAuthService) {
        authService.onTokenChange().subscribe((token) => console.log('Token Payload:', token.getPayload()));
        this.user$ = authService.onAuthenticationChange().pipe(
            switchMap((isAuthenticated) => {
                if (isAuthenticated) {
                    return api.getAuthSelf();
                }
                return of(null);
            }),
            tap((user) => console.log('authenticated', user)),
            shareReplay(1)
        );
    }
}
