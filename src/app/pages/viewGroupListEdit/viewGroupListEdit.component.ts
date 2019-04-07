import {Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';


import {
    ViewGroupMember,
    ViewGroupMemberOf,
    ViewGroupValueFields,
    ViewGroupValueMember,
    ViewGroupValueMemberOf,
    ViewListValue,
    ViewValueAssignment
} from '../../_models';
import {ApiService, ViewValue} from '../../_services';
import {NbDialogService} from '@nebular/theme';

export interface ViewGroupDataMember {
    viewName: string;
    primaryKey: string;
    view: ViewGroupMemberOf | ViewGroupMember;
    value: ViewGroupValueMemberOf | ViewGroupValueMember;
    isNew: boolean;

    foreignView: ViewValue;
}

@Component({
    selector: 'app-view-group-list-edit',
    templateUrl: './viewGroupListEdit.component.html',
})
export class ViewGroupListEditComponent implements OnChanges {
    @Output() reload = new EventEmitter<void>();
    @Output() submitCreate = new EventEmitter<void>();
    @Output() loadingChange = new EventEmitter<boolean>();
    error: string = null;
    submitted = false;
    available: ViewListValue;
    current: ViewListValue;
    currentKeys: string[] = [];
    @Input() data: ViewGroupDataMember = null;
    private _localLoading = true;

    filter = '';

    constructor(
        private api: ApiService,
        public dialogService: NbDialogService,
    ) {
    }

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

    updateCurrent() {
        if (this.data && this.data.foreignView && this.data.foreignView.data) {
            this.available = this.data.foreignView.data.filter(
                entry => this.currentKeys.indexOf(
                    <string>entry[this.data.foreignView.primaryKey]
                ) === -1
            );
        } else {
            this.available = [];
        }
        this.current = this.currentKeys.map(
            currentKey => this.safe_value(currentKey)
        );
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes.hasOwnProperty('data')) {
            if (this.data && this.data.value) {
                this.currentKeys = this.data.value.slice(0);
            } else {
                this.currentKeys = [];
            }
            this.updateCurrent();
        }
        console.log('Loading:', this.data);
        this._localLoading = (!this.data || !this.data.value || !this.data.foreignView || !this.data.foreignView.data);
    }

    public getFormData(entry: ViewValueAssignment): boolean {
        this.submitted = true;
        this.error = null;

        entry[this.data.view.key] = {
            'add': this.currentKeys.filter((cn) => this.data.value.indexOf(cn) === -1),
            'delete': this.data.value.filter((cn) => this.currentKeys.indexOf(cn) === -1),
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
            error => {
                console.log('Error:', error);
                if (error.error && error.error.memberOfGroups) {
                    this.error = error.error.memberOfGroups;
                } else if (error.error && error.error.ldap) {
                    this.error = error.error.ldap.text;
                } else {
                    this.error = error.statusText;
                }
                this.loading = false;
            }
        );
        return false;
    }

    add(pk: string) {
        if (this.currentKeys.indexOf(pk) === -1) {
            this.currentKeys.push(pk);
            this.updateCurrent();
        }
    }

    remove(pk: string) {
        const idx = this.currentKeys.indexOf(pk);
        if (idx !== -1) {
            this.currentKeys.splice(idx, 1);
            this.updateCurrent();
        }
    }

    private safe_value(primaryKey: string): ViewGroupValueFields {
        if (this.data && this.data.foreignView && this.data.foreignView.data) {
            const data = this.data.foreignView.data.find(
                entry => entry[this.data.foreignView.primaryKey] === primaryKey
            );
            if (data !== undefined && data !== null) {
                return data;
            }
        }
        const result: ViewGroupValueFields = {};
        this.data.foreignView.view.forEach((attr) => {
            if (attr.key === this.data.foreignView.primaryKey) {
                result[attr.key] = primaryKey;
            } else {
                result[attr.key] = null;
            }
        });
        return result;
    }
}
