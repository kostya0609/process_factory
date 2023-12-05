export type TCreateStatus = {
    title   : string;
    user_id : number;
}

export type TListStatus = {
    user_id : number;
}

export type TUpdateStatus = {
    id      : number;
    title   : string;
    user_id : number;
}

export type TDeleteStatus = {
    id      : number;
    user_id : number;
}

export type TAllProcess = {
    count         : number,
    page          : number,
    filter        : object,
    sort          : object,
    user_id       : number;
}

export type TCreateProcess = {
    title         : string;
    module_name   : string;
    document_link : string;
    user_id       : number;
}

export type TGetProcess = {
    id            : number;
    user_id       : number;
}

export type TStatus = {
    id           : number;
    status_title : string;
    sort         : string;
    stage_id     : number;
}

export type TUpdateProcess = {
    id            : number;
    title         : string;
    module_name   : string;
    document_link : string;
    statuses      : TStatus[];
    user_id       : number;
}

export type TCreateStage = {
    user_id : number;
}

export type TUpdateStage = {
    id      : number;
    user_id : number;
}

export type TDeleteStage = {
    id      : number;
    user_id : number;
}

export type TCreateApprovalRoute = {
    title   : string;
    user_id : number;
}

export type TListApprovalRoute = {
    user_id : number;
}

export type TUpdateApprovalRoute = {
    id      : number;
    title   : string;
    user_id : number;
}

export type TDeleteApprovalRoute = {
    id      : number;
    user_id : number;
}

export type TGetApprovalRoute = {
    id      : number;
    user_id : number;
}


