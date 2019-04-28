import {NbAuthJWTToken, NbAuthModule, NbAuthStrategyClass, NbPasswordAuthStrategy, NbPasswordAuthStrategyOptions} from '@nebular/auth';
import {getApiUrl} from '../_services';


/**
 * This class overrides the default endpoint handling for a flexible api endpoint.
 */
export class NbPasswordAuthStrategyEndpoint extends NbPasswordAuthStrategy {
    static setup(options: NbPasswordAuthStrategyOptions): [NbAuthStrategyClass, NbPasswordAuthStrategyOptions] {
        return [NbPasswordAuthStrategyEndpoint, options];
    }

    protected getActionEndpoint(action: string): string {
        const endpoint = super.getActionEndpoint(action);
        if (!endpoint) {
            return endpoint;
        }
        const apiUrl = getApiUrl();
        return apiUrl + endpoint;
    }
}


export const authModule = NbAuthModule.forRoot({
    strategies: [
        NbPasswordAuthStrategyEndpoint.setup({
            name: 'email',
            baseEndpoint: '',
            login: {
                endpoint: '/jwt-auth',
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
