export interface ViewField {
    key: string;
    type: string;
    title: string;
    required: boolean;
    creatable: boolean;
    readable: boolean;
    writable: boolean;
}

export interface ViewFieldText extends ViewField {
    field: string;
    format: string;
}

export interface ViewFieldPassword extends ViewField {
    field: string;
    autoGenerate: boolean;
    hashing: string;
}

export interface ViewFieldGenerate extends ViewField {
    field: string;
    format: string;
}

export interface ViewFieldIsMemberOf extends ViewField {
    field: string;
    memberOf: string;
    foreignView: string;
    foreignField: string;
}

export type ViewFieldAny = ViewFieldText | ViewFieldPassword | ViewFieldGenerate | ViewFieldIsMemberOf;

export interface ViewGroup {
    key: string;
    type: string;
    title: string;
}

export interface ViewGroupFields extends ViewGroup {
    fields: ViewFieldAny[];
}

export interface ViewGroupMemberOf extends ViewGroup {
    field: string;
    foreignView: string;
    foreignField: string;
}

export interface ViewGroupMember extends ViewGroup {
    field: string;
    foreignView: string;
    foreignField: string;
}

export type ViewGroupAny = ViewGroupFields | ViewGroupMemberOf | ViewGroupMember;

export type ViewList = ViewFieldAny[];
export type ViewDetails = ViewGroupAny[];

export interface View {
    key: string;
    primaryKey: string;
    permissions: string[];
    title: string;
    iconClasses: string;
    description: string;

    list: ViewList;
    details: ViewDetails;

    self?: ViewDetails;
    auth?: ViewList;
}

export interface ViewRegister {
    key: string;
    primaryKey: string;
    title: string;

    register: ViewDetails;
}

export type Views = View[];