import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NbTokenService, NbAuthJWTToken } from '@nebular/auth';

@Component({
    selector: 'ladm-token-login',
    template: '',
})
export class TokenLoginComponent implements OnInit, OnDestroy {
    destroyed$ = new Subject<void>();

    constructor(private route: ActivatedRoute, private tokenService: NbTokenService, private router: Router) {}

    ngOnInit() {
        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((queryParams) => {
            console.log('Activating token', queryParams);
            this.tokenService.set(new NbAuthJWTToken(queryParams.token, 'email')).subscribe(() => {
                this.router.navigate(['/']);
            });
        });
    }

    ngOnDestroy() {
        this.destroyed$.next();
    }
}
