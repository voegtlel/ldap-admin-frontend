import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { first, map, switchMap, takeUntil } from 'rxjs/operators';

import { View, ViewList, ViewListValue } from '../../_models';
import { ApiService, ListApiService, AuthService } from '../../_services';
import { BehaviorSubject, Observable, Subject, combineLatest, of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';

@Component({
    selector: 'ladm-view-list',
    templateUrl: './view-list.component.html',
})
export class ViewListComponent implements OnInit, OnDestroy {
    filter = '';
    loading = true;
    view$: Observable<View>;
    fields$: Observable<ViewList>;
    data$: Observable<ViewListValue>;
    view: View;
    readonly reload$ = new BehaviorSubject(null);
    private destroyed$ = new Subject<void>();

    constructor(
        private api: ApiService,
        private listApi: ListApiService,
        private activatedRoute: ActivatedRoute,
        private dialogService: NbDialogService,
        private toastrService: NbToastrService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loading = true;

        this.view$ = combineLatest([this.activatedRoute.paramMap, this.api.viewConfigSafe$]).pipe(
            switchMap(([params, views]) => {
                const view = views.find((view) => view.key === params.get('view') && view.details);
                if (!view) {
                    return throwError(`Invalid view ${params.get('view')}`);
                }
                return of(view);
            }),
            takeUntil(this.destroyed$)
        );

        this.view$.subscribe(
            () => {},
            (err) => {
                this.router.navigate(['/']);
            }
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
            switchMap((view) => this.listApi.getViewList(view.key)),
            takeUntil(this.destroyed$)
        );

        this.view$.subscribe((view) => {
            this.view = view;
        });

        this.data$.subscribe((data) => {
            this.loading = data === null;
        });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
    }

    performDelete(primaryKey: string) {
        this.loading = true;
        if (this.view === null) {
            console.log('Cannot delete without view');
            return;
        }
        this.api
            .deleteView(this.view.key, primaryKey)
            .pipe(first())
            .subscribe(
                () => {
                    this.loading = true;
                    this.reload$.next(null);
                },
                (error) => {
                    this.loading = false;
                    if (error.error) {
                        this.toastrService.danger(error.error.description, error.error.title);
                    } else {
                        this.toastrService.danger(error, 'Error while deleting');
                    }
                    console.log('Error:', error);
                }
            );
    }

    openDialog($event, dialogRef, context) {
        $event.stopPropagation();
        this.dialogService.open(dialogRef, { context });
    }
}
