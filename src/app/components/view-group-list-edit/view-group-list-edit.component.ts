import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, OnDestroy } from '@angular/core';

import {
    ViewGroupMember,
    ViewGroupMemberOf,
    ViewGroupValueFields,
    ViewGroupValueMember,
    ViewGroupValueMemberOf,
    ViewListValue,
    ViewValueAssignment,
    View,
} from '../../_models';
import { ApiService, ListApiService } from '../../_services';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { takeUntil, shareReplay, map } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface ViewGroupDataMember {
    viewName: string;
    primaryKey: string;
    view: ViewGroupMemberOf | ViewGroupMember;
    value: ViewGroupValueMemberOf | ViewGroupValueMember;
    isNew: boolean;

    foreignView: View;
}

@Component({
    selector: 'ladm-view-group-list-edit',
    templateUrl: './view-group-list-edit.component.html',
})
export class ViewGroupListEditComponent implements OnChanges, OnDestroy {
    private destroyed$ = new Subject<void>();
    @Output() reload = new EventEmitter<void>();
    @Output() submitCreate = new EventEmitter<void>();
    @Output() loadingChange = new EventEmitter<boolean>();
    error: string = null;
    submitted = false;
    current: ViewListValue;
    @Input() data: ViewGroupDataMember = null;
    private _localLoading = true;

    filter = '';

    constructor(
        private api: ApiService,
        private listApi: ListApiService,
        private dialogService: NbDialogService,
        private toastrService: NbToastrService
    ) {}

    private _loading = true;

    get loading(): boolean {
        return this._loading || this._localLoading;
    }

    set loading(value: boolean) {
        this._loading = value;
        this.loadingChange.emit(value);
    }

    @Input('loading') set setLoading(value) {
        this._loading = value;
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes.hasOwnProperty('data')) {
            this.current = this.data.value.slice(0);
        }
        this._localLoading = !this.data || !this.data.value || !this.data.foreignView;
    }

    openAddDialog($event, dialogRef) {
        $event.stopPropagation();
        const pk = this.data.foreignView.primaryKey;
        const context = {
            available$: this.listApi
                .getViewList((<ViewGroupMember | ViewGroupMemberOf>this.data.view).foreignView)
                .pipe(
                    map((data) =>
                        data.filter((entry) => !this.current.some((checkEntry) => checkEntry[pk] === entry[pk]))
                    ),
                    shareReplay(1),
                    takeUntil(this.destroyed$)
                ),
            view: this.data.foreignView,
        };
        this.dialogService.open(dialogRef, { context });
    }

    public getFormData(entry: ViewValueAssignment): boolean {
        this.submitted = true;
        this.error = null;
        const pk = this.data.foreignView.primaryKey;

        entry[this.data.view.key] = {
            add: this.current
                .filter((entry) => !this.data.value.some((checkEntry) => checkEntry[pk] === entry[pk]))
                .map((entry) => <string>entry[pk]),
            delete: this.data.value
                .filter((entry) => !this.current.some((checkEntry) => checkEntry[pk] === entry[pk]))
                .map((entry) => <string>entry[pk]),
        };

        return true;
    }

    onSubmit() {
        if (this.data.isNew) {
            this.submitCreate.emit();
            return;
        }

        this.error = null;

        const assignments: ViewValueAssignment = {};
        if (!this.getFormData(assignments)) {
            return;
        }

        this.loading = true;

        this.api.updateView(this.data.viewName, this.data.primaryKey, assignments).subscribe(
            () => {
                this.reload.emit();
            },
            (error) => {
                if (error.error) {
                    this.toastrService.danger(error.error.description, error.error.title || 'Cannot Save');
                    this.error = error.error.description;
                } else {
                    this.toastrService.danger(error, 'Error while saving');
                }
                console.log('Error:', error);
                this.loading = false;
            }
        );
        return false;
    }

    ngOnDestroy() {
        this.destroyed$.next();
    }

    add(entry: ViewGroupValueFields) {
        const pk = this.data.foreignView.primaryKey;
        if (!this.current.some((checkEntry) => checkEntry[pk] === entry[pk])) {
            this.current.push(entry);
        }
    }

    remove(entry: ViewGroupValueFields) {
        const pk = this.data.foreignView.primaryKey;
        const idx = this.current.findIndex((checkEntry) => checkEntry[pk] === entry[pk]);
        if (idx !== -1) {
            this.current.splice(idx, 1);
        }
    }
}
