import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, startWith, switchMap, shareReplay } from 'rxjs/operators';
import { ViewList, ViewListValue } from '../_models';
import { ApiService } from './api.service';

export interface ViewValue {
    data: ViewListValue | null;
    view: ViewList;
    primaryKey: string;
    viewName: string;
    title: string;
}

@Injectable({
    providedIn: 'root',
})
export class ListApiService {
    private reload$ = new BehaviorSubject(null);

    private lists: { [key: string]: Observable<ViewValue> } = {};
    private reloads$: { [key: string]: BehaviorSubject<void> } = {};

    constructor(private api: ApiService) {}

    public reload(viewKey?: string) {
        if (viewKey) {
            this.reloads$[viewKey].next(null);
        } else {
            this.reload$.next(null);
        }
    }

    public getViewList(viewName: string): Observable<ViewValue> {
        if (!this.lists.hasOwnProperty(viewName)) {
            this.reloads$[viewName] = new BehaviorSubject(null);
            this.lists[viewName] = combineLatest([this.reload$, this.reloads$[viewName]]).pipe(
                switchMap(() => this.api.viewConfigSafe$),
                switchMap(views =>
                    this.api.getViewList(viewName).pipe(
                        startWith(<ViewListValue>null),
                        shareReplay(1),
                        map(data => {
                            const view = views[views.findIndex(foreignView => foreignView.key === viewName)];
                            return {
                                view: view.list,
                                data: data,
                                viewName: viewName,
                                primaryKey: view.primaryKey,
                                title: view.title,
                            };
                        })
                    )
                ),
                shareReplay(1)
            );
        }

        return this.lists[viewName];
    }
}
