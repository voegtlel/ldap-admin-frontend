export type ViewFieldValueText = string;
export type ViewFieldValuePassword = string;
export type ViewFieldValueGenerate = string;
export type ViewFieldValueMemberOf = boolean;
export type ViewFieldValueAny =
    | ViewFieldValueText
    | ViewFieldValuePassword
    | ViewFieldValueGenerate
    | ViewFieldValueMemberOf;

export interface ViewGroupValueFields {
    [key: string]: ViewFieldValueAny;
}

export type ViewListValue = ViewGroupValueFields[];

export type ViewGroupValueMemberOf = string[];
export type ViewGroupValueMember = string[];
export type ViewGroupValueAny = ViewGroupValueFields | ViewGroupValueMemberOf | ViewGroupValueMember;

export interface ViewDetailValue {
    [key: string]: ViewGroupValueAny;
}

export interface ViewGroupValueAssignmentMemberOf {
    add: string[];
    delete: string[];
}
export interface ViewGroupValueAssignmentMember {
    add: string[];
    delete: string[];
}
export type ViewGroupValueAssignmentAny =
    | ViewGroupValueFields
    | ViewGroupValueAssignmentMemberOf
    | ViewGroupValueAssignmentMember;

export interface ViewValueAssignment {
    [key: string]: ViewGroupValueAssignmentAny;
}
