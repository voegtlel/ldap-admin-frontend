import { Injectable } from '@angular/core';
import { switchMap, shareReplay } from 'rxjs/operators';
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

    constructor(private api: ApiService, private authService: NbAuthService) {
        this.user$ = authService.isAuthenticated().pipe(
            switchMap(isAuthenticated => {
                if (isAuthenticated) {
                    return api.getAuthSelf();
                }
                return of(null);
            }),
            shareReplay(1)
        );
    }
}
