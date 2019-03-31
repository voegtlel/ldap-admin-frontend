import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {first, map, switchMap} from 'rxjs/operators';

import {View, ViewList, ViewListValue} from '../../_models';
import {ApiService, ListApiService} from '../../_services';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {NbDialogService} from '@nebular/theme';


@Component({
    selector: 'app-view-list',
    templateUrl: './viewList.component.html',
})
export class ViewListComponent implements OnInit, OnDestroy {
    filter = '';
    loading = true;
    view$: Observable<View>;
    fields$: Observable<ViewList>;
    data$: Observable<ViewListValue>;
    view: View;
    readonly reload$ = new BehaviorSubject(null);
    @ViewChild('deleteModalBox') deleteModalBox;
    private readonly subscriptions: Subscription[] = [];

    constructor(
        private api: ApiService,
        private listApi: ListApiService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private dialogService: NbDialogService,
    ) {
    }

    ngOnInit() {
        this.loading = true;

        this.view$ = this.activatedRoute.paramMap.pipe(
            switchMap(params => this.api.viewConfigSafe$.pipe(map((views) =>
                views[views.findIndex(view => view.key === params.get('view'))]
            )))
        );

        this.fields$ = this.view$.pipe(map((view) => view.list));

        this.reload$.subscribe(() => {
            this.loading = true;
            if (this.view) {
                this.listApi.reload(this.view.key);
            }
        });

        this.data$ = this.reload$.pipe(
            switchMap(() => this.view$),
            switchMap(
                (view) => this.listApi.getViewList(view.key)
            ),
            map(data => data.data)
        );

        this.subscriptions.push(this.view$.subscribe((view) => {
            this.view = view;
        }));

        this.subscriptions.push(this.data$.subscribe((data) => {
            this.loading = !data;
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    performDelete(primaryKey: string) {
        this.loading = true;
        if (this.view === null) {
            console.log('Cannot delete without view');
        }
        this.api.deleteView(this.view.key, primaryKey).pipe(first()).subscribe(
            () => {
                this.loading = true;
                this.reload$.next(null);
            },
            (err) => {
                this.loading = false;
                console.log(err);
            }
        );
    }
}
