import { Reason } from "@walletconnect/types";

// source: https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
export const enumify = <T extends { [index: string]: U }, U extends string>(x: T): T => x;

export function capitalizeWord(word: string) {
  return word.trim().replace(/^\w/, c => c.toUpperCase());
}

export function capitalize(str: string) {
  return str
    .split(" ")
    .map(w => capitalizeWord(w))
    .join(" ");
}

export const ERROR = enumify({
  UNKNOWN: "UNKNOWN",
  GENERIC: "GENERIC",
  INVALID_APP_METADATA: "INVALID_APP_METADATA",
  NO_MATCHING_PENDING_PAIRING: "NO_MATCHING_PENDING_PAIRING",
  NO_MATCHING_PENDING_SESSION: "NO_MATCHING_PENDING_SESSION",
  MISSING_SESSION_RESPONSE: "MISSING_SESSION_RESPONSE",
  RECORD_ALREADY_EXISTS: "RECORD_ALREADY_EXISTS",
  MISMATCHED_TOPIC: "MISMATCHED_TOPIC",
  NO_MATCHING_ID: "NO_MATCHING_ID",
  NO_MATCHING_TOPIC: "NO_MATCHING_TOPIC",
  RESTORE_WILL_OVERRIDE: "RESTORE_WILL_OVERRIDE",
  UNAUTHORIZED_JSON_RPC_METHOD: "UNAUTHORIZED_JSON_RPC_METHOD",
  UNKNOWN_JSON_RPC_METHOD: "UNKNOWN_JSON_RPC_METHOD",
  SETTLE_TIMEOUT: "SETTLE_TIMEOUT",
  JSON_RPC_REQUEST_TIMEOUT: "JSON_RPC_REQUEST_TIMEOUT",
  UNAUTHORIZED_UPDATE_REQUEST: "UNAUTHORIZED_UPDATE_REQUEST",
  INVALID_UPDATE_REQUEST: "INVALID_UPDATE_REQUEST",
  UNAUTHORIZED_UPGRADE_REQUEST: "UNAUTHORIZED_UPGRADE_REQUEST",
  UNAUTHORIZED_TARGET_CHAIN: "UNAUTHORIZED_TARGET_CHAIN",
  UNAUTHORIZED_NOTIFICATION_TYPE: "UNAUTHORIZED_NOTIFICATION_TYPE",
  MISSING_DECRYPT_PARAMS: "MISSING_DECRYPT_PARAMS",
  SETTLED: "SETTLED",
  NOT_APPROVED: "NOT_APPROVED",
  PROPOSAL_RESPONDED: "PROPOSAL_RESPONDED",
  RESPONSE_ACKNOWLEDGED: "RESPONSE_ACKNOWLEDGED",
  MATCHING_CONTROLLER: "MATCHING_CONTROLLER",
});

export type ClientError = Reason;

export type ClientErrorType = keyof typeof ERROR;

export type ClientErrorFormat = (params?: any) => ClientError;

export interface ClientErrorMap {
  [type: string]: ClientErrorFormat;
}

export const ERROR_MAP: ClientErrorMap = {
  [ERROR.UNKNOWN]: (params?: any) => ({
    code: 9999,
    message: `Unknown error${params ? `: ${params.toString()}` : ""}`,
  }),
  [ERROR.GENERIC]: (params?: any) => ({
    code: 9999,
    message: params.message,
  }),
  [ERROR.INVALID_APP_METADATA]: () => ({
    code: 9999,
    message: "Missing or invalid app metadata provided",
  }),
  [ERROR.NO_MATCHING_PENDING_PAIRING]: () => ({
    code: 9999,
    message: "No Pairing Response found in pending proposal",
  }),
  [ERROR.NO_MATCHING_PENDING_SESSION]: () => ({
    code: 9999,
    message: "No Session Response found in pending proposal",
  }),
  [ERROR.MISSING_SESSION_RESPONSE]: () => ({
    code: 9999,
    message: "Response is required for approved session proposals",
  }),
  [ERROR.RECORD_ALREADY_EXISTS]: (params: any) => ({
    code: 9999,
    message: `Record already exists for ${params.context} matching id: ${params.id}`,
  }),
  [ERROR.MISMATCHED_TOPIC]: (params: any) => ({
    code: 9999,
    message: `Mismatched topic for ${params.context} with id: ${params.id}`,
  }),
  [ERROR.NO_MATCHING_ID]: (params: any) => ({
    code: 9999,
    message: `No matching ${params.context} with id: ${params.id}`,
  }),
  [ERROR.NO_MATCHING_TOPIC]: (params: any) => ({
    code: 9999,
    message: `No matching ${params.context} with topic: ${params.topic}`,
  }),
  [ERROR.RESTORE_WILL_OVERRIDE]: (params: any) => ({
    code: 9999,
    message: `Restore will override already set ${params.context}`,
  }),
  [ERROR.UNAUTHORIZED_JSON_RPC_METHOD]: (params: any) => ({
    code: 9999,
    message: `Unauthorized JSON-RPC Method Requested: ${params.method}`,
  }),
  [ERROR.UNKNOWN_JSON_RPC_METHOD]: (params: any) => ({
    code: 9999,
    message: `Unknown JSON-RPC Method Requested: ${params.method}`,
  }),
  [ERROR.SETTLE_TIMEOUT]: (params: any) => ({
    code: 9999,
    message: `${capitalize(params.context)} failed to settle after ${params.maxTimeout /
      1000} seconds`,
  }),
  [ERROR.JSON_RPC_REQUEST_TIMEOUT]: (params: any) => ({
    code: 9999,
    message: `JSON-RPC Request timeout after ${params.maxTimeout / 1000} seconds: ${params.method}`,
  }),
  [ERROR.UNAUTHORIZED_UPDATE_REQUEST]: (params: any) => ({
    code: 9999,
    message: `Unauthorized ${params.context} update request`,
  }),
  [ERROR.INVALID_UPDATE_REQUEST]: (params: any) => ({
    code: 9999,
    message: `Invalid ${params.context} update request`,
  }),
  [ERROR.UNAUTHORIZED_UPGRADE_REQUEST]: (params: any) => ({
    code: 9999,
    message: `Unauthorized ${params.context} ugprade request`,
  }),
  [ERROR.UNAUTHORIZED_TARGET_CHAIN]: (params: any) => ({
    code: 9999,
    message: `Unauthorized Target ChainId Requested: ${params.chainId}`,
  }),
  [ERROR.UNAUTHORIZED_NOTIFICATION_TYPE]: (params: any) => ({
    code: 9999,
    message: `Unauthorized Notification Type Requested: ${params.type}`,
  }),
  [ERROR.MISSING_DECRYPT_PARAMS]: (params: any) => ({
    code: 9999,
    message: `Decrypt params required for ${params.context}`,
  }),
  [ERROR.SETTLED]: (params: any) => ({
    code: 9999,
    message: `${capitalize(params.context)} settled`,
  }),
  [ERROR.NOT_APPROVED]: (params: any) => ({
    code: 9999,
    message: `${capitalize(params.context)} not approved`,
  }),
  [ERROR.PROPOSAL_RESPONDED]: (params: any) => ({
    code: 9999,
    message: `${capitalize(params.context)} proposal responded`,
  }),
  [ERROR.RESPONSE_ACKNOWLEDGED]: (params: any) => ({
    code: 9999,
    message: `${capitalize(params.context)} response acknowledge`,
  }),
  [ERROR.MATCHING_CONTROLLER]: (params: any) => ({
    code: 9999,
    message: `Peer is also ${params.controller ? "" : "not "}controller`,
  }),
};

export function getClientError(type: ClientErrorType, params?: any): ClientError {
  const formatError = ERROR_MAP[type];
  if (typeof formatError === "undefined") return getClientError(ERROR.UNKNOWN, params);
  return formatError(params);
}