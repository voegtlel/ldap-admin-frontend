import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { startWith, switchMap, shareReplay } from 'rxjs/operators';
import { ViewListValue } from '../_models';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root',
})
export class ListApiService {
    private reload$ = new BehaviorSubject(null);

    private lists: { [key: string]: Observable<ViewListValue> } = {};
    private reloads$: { [key: string]: BehaviorSubject<void> } = {};

    constructor(private api: ApiService) {}

    public reload(viewKey?: string) {
        if (viewKey) {
            if (this.reloads$.hasOwnProperty(viewKey)) {
                this.reloads$[viewKey].next(null);
            }
        } else {
            this.reload$.next(null);
        }
    }

    public getViewList(viewName: string): Observable<ViewListValue> {
        if (!this.lists.hasOwnProperty(viewName)) {
            this.reloads$[viewName] = new BehaviorSubject(null);
            this.lists[viewName] = combineLatest([this.reload$, this.reloads$[viewName]]).pipe(
                switchMap(() => this.api.viewConfigSafe$),
                switchMap(() => this.api.getViewList(viewName).pipe(shareReplay(1))),
                shareReplay(1)
            );
        }

        return this.lists[viewName];
    }
}
