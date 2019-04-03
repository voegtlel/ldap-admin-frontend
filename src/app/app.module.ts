import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {
    NbAccordionModule,
    NbActionsModule,
    NbAlertModule,
    NbButtonModule,
    NbCalendarKitModule,
    NbCalendarModule,
    NbCalendarRangeModule,
    NbCardModule,
    NbChatModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbDatepickerModule,
    NbDialogModule,
    NbInputModule,
    NbLayoutModule,
    NbListModule,
    NbMenuModule,
    NbPopoverModule,
    NbProgressBarModule,
    NbRadioModule,
    NbRouteTabsetModule,
    NbSearchModule,
    NbSelectModule,
    NbSidebarModule,
    NbSidebarService,
    NbSpinnerModule,
    NbStepperModule,
    NbTabsetModule,
    NbThemeModule,
    NbToastrModule,
    NbTooltipModule,
    NbUserModule,
    NbWindowModule,
} from '@nebular/theme';

import {NB_AUTH_TOKEN_INTERCEPTOR_FILTER, NbAuthJWTInterceptor} from '@nebular/auth';

import {APP_BASE_HREF} from '@angular/common';

import {AppComponent} from './app.component';

import {routing} from './app.routing';

import {authModule} from './auth/auth.module';
import {LoginComponent} from './auth/login/login.component';

import {PagesComponent} from './pages/pages.component';
import {HomeComponent} from './pages/home/home.component';
import {ViewEditComponent} from './pages/viewEdit/viewEdit.component';
import {FormElementComponent} from './pages/formElement/formElement.component';
import {ViewGroupFieldsEditComponent} from './pages/viewGroupFieldsEdit/viewGroupFieldsEdit.component';
import {ViewGroupListEditComponent} from './pages/viewGroupListEdit/viewGroupListEdit.component';
import {ViewListComponent} from './pages/viewList/viewList.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FilterModelPipe} from './_pipes';

@NgModule({
    declarations: [
        AppComponent,
        PagesComponent,
        HomeComponent,
        LoginComponent,
        FormElementComponent,
        ViewEditComponent,
        ViewGroupFieldsEditComponent,
        ViewGroupListEditComponent,
        ViewListComponent,
        FilterModelPipe,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NbThemeModule.forRoot(),
        NbMenuModule.forRoot(),
        NbToastrModule.forRoot(),
        NbDialogModule.forRoot(),
        authModule,
        NbActionsModule,
        NbCardModule,
        NbLayoutModule,
        NbMenuModule,
        NbRouteTabsetModule,
        NbSearchModule,
        NbSidebarModule,
        NbTabsetModule,
        NbThemeModule,
        NbUserModule,
        NbCheckboxModule,
        NbPopoverModule,
        NbContextMenuModule,
        NbProgressBarModule,
        NbCalendarModule,
        NbCalendarRangeModule,
        NbStepperModule,
        NbButtonModule,
        NbInputModule,
        NbAccordionModule,
        NbDatepickerModule,
        NbDialogModule,
        NbWindowModule,
        NbListModule,
        NbToastrModule,
        NbAlertModule,
        NbSpinnerModule,
        NbRadioModule,
        NbSelectModule,
        NbChatModule,
        NbTooltipModule,
        NbCalendarKitModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        routing,
        NgbModule,
    ],
    providers: [
        NbSidebarService,
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: HTTP_INTERCEPTORS, useClass: NbAuthJWTInterceptor, multi: true},
        { provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: function () { return false; }, },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
