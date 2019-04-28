import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';


@Component({
    selector: 'app-form-element',
    templateUrl: './formElement.component.html',
    styleUrls: ['./formElement.component.scss'],
})
export class FormElementComponent implements OnInit {
    @Input() formControlRef: FormControl;
    @Input() type = 'text';
    @Input() title: string;
    @Input() readonly = false;

    @Input() submitted: boolean;

    @Input() togglePassword = false;
    asText = false;

    get showText(): boolean {
        return this.type !== 'password' || this.asText;
    }

    constructor() {
    }

    ngOnInit() {
    }

    get error(): string {
        if (this.formControlRef.errors) {
            if (this.formControlRef.errors.required && (this.submitted || this.formControlRef.dirty)) {
                return this.title + ' is required';
            } else if (this.formControlRef.errors.matchPassword && (this.submitted || this.formControlRef.dirty)) {
                return 'Passwords do not match';
            } else if (this.formControlRef.errors.pattern && (this.submitted || this.formControlRef.dirty)) {
                return this.title + ' invalid. Expecting ' + this.formControlRef.errors.pattern.requiredPattern + '.';
            } else if (this.formControlRef.errors.external) {
                return this.formControlRef.errors.external;
            }
        }
        return null;
    }
}
