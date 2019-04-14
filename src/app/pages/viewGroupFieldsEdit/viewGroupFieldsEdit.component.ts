import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange} from '@angular/core';

import {ViewGroupFields, ViewGroupValueFields, ViewValueAssignment} from '../../_models';
import {ApiService} from '../../_services';
import {AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {NbToastrService} from '@nebular/theme';


export interface ViewGroupDataFields {
    viewName: string;
    primaryKey: string;
    view: ViewGroupFields;
    value: ViewGroupValueFields;

    isNew: boolean;
}


function matchPasswordValidator(passwordName: string) {
    function matchPasswords(control: AbstractControl) {
        const password1 = control.get(passwordName);
        const password2 = control.get('_' + passwordName + 'Repeat');
        if (password1.value !== password2.value) {
            password2.setErrors({matchPassword: true});
        }
        return null;
    }

    return matchPasswords;
}

class FormControlWithOriginal extends FormControl {
    public originalValue: any;

    constructor(
        formState?: any,
        validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
        asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null, originalValue?: any
    ) {
        super(formState, validatorOrOpts, asyncValidator);
        if (originalValue === null) {
            this.originalValue = formState;

        } else {
            this.originalValue = originalValue;
        }
    }

    public markAsPristine(opts?: { onlySelf?: boolean }): void {
        super.markAsPristine(opts);
        this.originalValue = this.value;
    }

}


@Component({
    selector: 'app-view-group-fields-edit',
    templateUrl: './viewGroupFieldsEdit.component.html',
})
export class ViewGroupFieldsEditComponent implements OnInit, OnChanges {
    form: FormGroup;
    @Output() loadingChange = new EventEmitter<boolean>();
    submitted = false;
    @Output() reload = new EventEmitter<void>();
    @Output() submitCreate = new EventEmitter<void>();
    @Input() data: ViewGroupDataFields;
    private _localLoading = true;

    constructor(
        private api: ApiService,
        private toastrService: NbToastrService,
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

    ngOnInit() {
    }

    updateViews() {
        if (this.data) {
            this.form = new FormGroup(
                this.data.view.fields.reduce((obj2, field) => {
                    let fieldValue: string | boolean = '';
                    const validators: ValidatorFn[] = [];
                    if (field.readable && this.data.value) {
                        fieldValue = this.data.value[field.key];
                    }
                    if (field.required) {
                        validators.push(Validators.required);
                    }
                    obj2[field.key] = new FormControlWithOriginal(fieldValue, validators);
                    if (field.type === 'password' && !field.readable) {
                        obj2['_' + field.key + 'Repeat'] = new FormControlWithOriginal(fieldValue, validators);
                    }
                    return obj2;
                }, {}), this.data.view.fields.reduce((validators, field) => {
                    if (field.type === 'password' && !field.readable) {
                        validators.push(matchPasswordValidator(field.key));
                    }
                    return validators;
                }, [])
            );
            this.form.markAsUntouched();
            this.form.markAsPristine();
        } else {
            this.form = null;
        }
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes.hasOwnProperty('data')) {
            this.updateViews();
            this._localLoading = (!this.data || !(this.data.value || this.data.isNew));
        }
    }

    public getFormData(entry: ViewValueAssignment): boolean {
        this.submitted = true;

        const entryFields: ViewGroupValueFields = {};

        // stop here if form is invalid
        if (this.form.invalid) {
            console.log('Form is invalid', this.form);
            return false;
        }

        this.data.view.fields.forEach((field) => {
            const formField = <FormControlWithOriginal>this.form.get(field.key);
            formField.setErrors(null);
            if (formField.dirty) {
                entryFields[field.key] = formField.value;
            }
        });

        entry[this.data.view.key] = entryFields;

        return true;
    }

    public setErrors(errors: {[key: string]: string} = null) {
        this.form.updateValueAndValidity();
        if (errors !== null) {
            Object.entries(errors).forEach(([key, err]) => {
                if (this.form.contains(key)) {
                    this.form.get(key).setErrors({external: err});
                }
            });
        }
    }

    onSubmit() {
        if (this.data.isNew) {
            this.submitCreate.emit();
            return;
        }

        const entry: ViewValueAssignment = {};
        if (!this.getFormData(entry)) {
            return;
        }

        this.loading = true;

        const query = this.api.updateView(this.data.viewName, this.data.primaryKey, entry);
        query.subscribe(
            () => {
                this._localLoading = true;
                this.reload.emit();
            },
            (error: HttpErrorResponse) => {
                if (error.error) {
                    this.toastrService.danger(error.error.description, error.error.title);
                    if (error.error.field) {
                        if (error.error.field.hasOwnProperty(this.data.view.key)) {
                            this.setErrors(error.error.field[this.data.view.key]);
                        } else {
                            this.setErrors(error.error.field);
                        }
                    }
                } else {
                    this.toastrService.danger(error, 'Error while saving');
                }
                console.log('Error:', error);
                this.loading = false;
            }
        );
        return false;
    }
}
