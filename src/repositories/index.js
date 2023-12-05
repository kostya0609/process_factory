import {UserRepository}             from "./UserRepository";
import {AccessesRepository}         from "./AccessesRepository";
import {ProcessRepository}          from "./ProcessRepository";
import {GridRepository}             from "./GridRepository"
import {StatusRepository}           from "./StatusRepository"
import {TypeRepository}             from "./TypeRepository";
import {StageRepository}            from "./StageRepository";
import {ApprovalRoutesRepository}   from "./ApprovalRoutesRepository"

export const UserRepo           = new UserRepository();
export const AccessesRepo       = new AccessesRepository();
export const ProcessRepo        = new ProcessRepository();
export const GridRepo           = new GridRepository();
export const StatusRepo         = new StatusRepository();
export const TypeRepo           = new TypeRepository();
export const StageRepo          = new StageRepository();
export const ApprovalRoutesRepo = new ApprovalRoutesRepository();

