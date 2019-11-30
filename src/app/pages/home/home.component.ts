import { Component } from '@angular/core';
import { ApiService, AuthService } from '../../_services';
import { map } from 'rxjs/operators';
import { Subject, combineLatest, Observable } from 'rxjs';
import { View } from 'src/app/_models';

interface ViewWithPermission extends View {
    isPermitted: boolean;
}

@Component({
    selector: 'ladm-home',
    templateUrl: './home.component.html',
})
export class HomeComponent {
    views$: Observable<ViewWithPermission[]>;

    constructor(public api: ApiService, public auth: AuthService) {
        this.views$ = combineLatest([auth.user$, this.api.viewConfigSafe$]).pipe(
            map(([user, viewConfig]) =>
                viewConfig.map((view) => ({
                    ...view,
                    isPermitted: view.permissions.some((permission) => user && user[permission]),
                }))
            )
        );
    }
}
