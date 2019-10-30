import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpRequest } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    NbIconModule,
} from '@nebular/theme';

import { NB_AUTH_TOKEN_INTERCEPTOR_FILTER, NbAuthJWTInterceptor } from '@nebular/auth';

import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';

import { routing } from './app.routing';

import { DepotManAuthModule, NbPasswordAuthStrategyEndpoint } from './auth/auth.module';

import { PagesComponent } from './pages/pages.component';
import { HomeComponent } from './pages/home/home.component';
import { ViewEditComponent } from './pages/view-edit/view-edit.component';
import { FormElementComponent } from './pages/form-element/form-element.component';
import { ViewGroupFieldsEditComponent } from './pages/view-group-fields-edit/view-group-fields-edit.component';
import { ViewGroupListEditComponent } from './pages/view-group-list-edit/view-group-list-edit.component';
import { ViewListComponent } from './pages/view-list/view-list.component';
import { FilterModelPipe } from './_pipes';
import { HttpErrorHandler } from './_services';

@NgModule({
    declarations: [
        AppComponent,
        PagesComponent,
        HomeComponent,
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
        NbDatepickerModule.forRoot(),
        DepotManAuthModule,
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
        NbIconModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        routing,
    ],
    providers: [
        NbSidebarService,
        NbPasswordAuthStrategyEndpoint,
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: HTTP_INTERCEPTORS, useClass: NbAuthJWTInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorHandler, multi: true },
        {
            provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER,
            useValue: (req: HttpRequest<any>) => req.url.endsWith('/jwt-auth'),
        },
    ],

    bootstrap: [AppComponent],
})
export class AppModule {}
