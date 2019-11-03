import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { map, startWith, switchMap, shareReplay, takeUntil } from 'rxjs/operators';

import {
    View,
    ViewGroup,
    ViewGroupMember,
    ViewGroupMemberOf,
    ViewGroupValueAny,
    ViewGroupValueFields,
    ViewValueAssignment,
    ViewDetailValue,
} from '../../_models';
import { ApiService, ListApiService, ViewValue } from '../../_services';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewGroupFieldsEditComponent } from '../view-group-fields-edit/view-group-fields-edit.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ViewGroupListEditComponent } from '../view-group-list-edit/view-group-list-edit.component';
import { NbToastrService } from '@nebular/theme';

const NEWVALUE: ViewDetailValue = {};

export interface ViewGroupData {
    viewName: string;
    primaryKey: string;
    view: ViewGroup;
    value: ViewGroupValueAny;

    isNew: boolean;

    foreignView?: ViewValue;
}

@Component({
    selector: 'ladm-view-edit',
    templateUrl: './view-edit.component.html',
})
export class ViewEditComponent implements OnInit, OnDestroy {
    loading = true;
    data$: Observable<ViewGroupData[]>;
    view: View = null;
    @ViewChildren(ViewGroupFieldsEditComponent) fieldsControls: QueryList<ViewGroupFieldsEditComponent>;
    @ViewChildren(ViewGroupListEditComponent) listControls: QueryList<ViewGroupListEditComponent>;
    private readonly reload$ = new BehaviorSubject(null);
    private destroyed$ = new Subject<void>();

    constructor(
        private api: ApiService,
        private listApi: ListApiService,
        private router: Router,
        public activatedRoute: ActivatedRoute,
        private toastrService: NbToastrService
    ) {}

    ngOnInit() {
        this.reload$.subscribe(() => {
            this.loading = true;
            if (this.data$) {
                this.listApi.reload();
            }
        });

        const primaryKeyView$ = this.activatedRoute.paramMap.pipe(
            switchMap(params =>
                this.api.viewConfigSafe$.pipe(
                    map(views => {
                        this.view = views[views.findIndex(view => view.key === params.get('view'))];
                        return {
                            primaryKey: params.get('primaryKey'),
                            view: this.view,
                        };
                    })
                )
            ),
            shareReplay(1),
            takeUntil(this.destroyed$)
        );

        const data$ = this.reload$.pipe(
            switchMap(() => primaryKeyView$),
            switchMap(primaryKeyView =>
                primaryKeyView.primaryKey === null
                    ? of(NEWVALUE)
                    : this.api.getView(primaryKeyView.view.key, primaryKeyView.primaryKey)
            ),
            shareReplay(1),
            takeUntil(this.destroyed$)
        );

        this.data$ = combineLatest([primaryKeyView$, data$.pipe(startWith(<ViewDetailValue>null))]).pipe(
            map(([primaryKeyView, data]) =>
                primaryKeyView.view.details.map(viewGroup => {
                    return {
                        primaryKey: primaryKeyView.primaryKey,
                        viewName: primaryKeyView.view.key,
                        view: viewGroup,
                        value:
                            data === null || data === NEWVALUE
                                ? viewGroup.type === 'member' || viewGroup.type === 'memberOf'
                                    ? []
                                    : null
                                : data[viewGroup.key],
                        isNew: data === NEWVALUE,
                    };
                })
            ),
            switchMap(entries =>
                combineLatest(
                    entries.map(entry => {
                        if (entry.view.type === 'member' || entry.view.type === 'memberOf') {
                            return this.listApi
                                .getViewList((<ViewGroupMember | ViewGroupMemberOf>entry.view).foreignView)
                                .pipe(
                                    map(foreignViewValue => {
                                        return {
                                            primaryKey: entry.primaryKey,
                                            viewName: entry.viewName,
                                            view: entry.view,
                                            value: entry.value,
                                            isNew: entry.isNew,
                                            foreignView: foreignViewValue,
                                        };
                                    }),
                                    startWith(<ViewGroupData>null)
                                );
                        }
                        return of(entry);
                    })
                )
            ),
            takeUntil(this.destroyed$)
        );

        this.data$.subscribe(
            data => {
                this.loading = !(data && (data.length === 0 || data[0].value !== null || data[0].isNew));
            },
            error => {
                if (error.error) {
                    this.toastrService.danger(error.error.description, error.error.title);
                    if (error.error.field) {
                        this.fieldsControls.forEach(control =>
                            control.setErrors(error.error.field[control.data.view.key])
                        );
                    }
                } else {
                    this.toastrService.danger(error, error.statusText);
                }
                console.log('Error:', error);
                this.loading = false;
                this.router.navigate(['/list', this.view.key], { relativeTo: this.activatedRoute });
            }
        );
    }

    onReload() {
        this.reload$.next(null);
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
    }

    onCreate() {
        const entry: ViewValueAssignment = {};
        if (this.fieldsControls.some(control => !control.getFormData(entry))) {
            return;
        }
        if (this.listControls.some(control => !control.getFormData(entry))) {
            return;
        }

        const primaryKeyContainer = Object.values(entry).find(val => val.hasOwnProperty(this.view.primaryKey));
        const primaryKey = (<ViewGroupValueFields>primaryKeyContainer)[this.view.primaryKey];

        this.loading = true;

        const query = this.api.createView(this.view.key, entry);
        query.subscribe(
            () => {
                this.loading = true;
                this.listApi.reload(this.view.key);
                this.router.navigate(['/edit', this.view.key, primaryKey]);
            },
            (error: HttpErrorResponse) => {
                if (error.error) {
                    this.toastrService.danger(error.error.description, error.error.title);
                    if (error.error.field) {
                        this.fieldsControls.forEach(control =>
                            control.setErrors(error.error.field[control.data.view.key])
                        );
                    }
                } else {
                    this.toastrService.danger(error, error.statusText);
                }
                console.log('Error:', error);
                this.loading = false;
            }
        );
        return false;
    }
}
