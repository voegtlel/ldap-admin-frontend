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

    constructor() {
    }

    ngOnInit() {
    }
}
