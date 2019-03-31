import {NbAuthJWTToken, NbAuthModule, NbPasswordAuthStrategy} from '@nebular/auth';
import {environment} from '../../environments/environment';

export const authModule = NbAuthModule.forRoot({
    strategies: [
        NbPasswordAuthStrategy.setup({
            name: 'email',
            baseEndpoint: environment.apiUrl,
            login: {
                endpoint: '/jwt-auth/',
                defaultErrors: ['Username/password combination is not correct, please try again.'],
                defaultMessages: ['You have been successfully logged in.'],
            },
            logout: {
                endpoint: '',
                defaultErrors: ['Something went wrong, please try again.'],
                defaultMessages: ['You have been successfully logged out.'],
            },
            token: {
                class: NbAuthJWTToken,
                key: 'token'
            },
            validation: {
                email: {
                    regexp: '.*',
                }
            }
        }),
    ],
    forms: {
        login: {},
        requestPassword: {showMessages: {success: true, error: true}},
        resetPassword: {showMessages: {success: true, error: true}},
        logout: {
            redirectDelay: 0,
        },
    },
});
