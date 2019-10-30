import { AntiSpamAnswerModel } from './anti_spam';
import { ViewGroupValueAny } from './model';

export interface AuthUserModel {
    primaryKey: string;
    displayName: string;
    mail: string;

    // Additional fields for permissions
    [key: string]: boolean | string;
}

export interface RegisterUserModel {
    signupComment: string;
    antiSpam: AntiSpamAnswerModel;

    [key: string]: ViewGroupValueAny | string | AntiSpamAnswerModel;
}
