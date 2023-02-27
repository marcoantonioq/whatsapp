import EventEmitter from "events";
import * as puppeteer from "puppeteer";

export interface Module {
  repo: any;
  create(): Promise<Module>;
}

export interface GOOGLE_SHEET_GET {
  spreadsheetId: string;
  range: string;
  listener: Function;
}

export interface GOOGLE_SHEET_SAVE {
  spreadsheetId: string;
  range: string;
  values: any[][];
  listener?: Function;
}

export interface CONTACTS_GET {
  listener: Function;
}

export enum EventsApp {
  READY = "ready",
  UPDATE = "update",
  QR_RECEIVED = "qr",
  REBOOT = "reboot",
  MESSAGES = "messages",
  MESSAGE_CREATE = "message_create",
  MESSAGE_SEND = "message_send",
  FORWARD_MESSAGES = "forward_messages",
  CONTACTS = "contacts",
  STATUS = "app_status",
  CLEAR = "clear_chat",
  GOOGLE_SHEET_GET = "google_sheet_get",
  GOOGLE_SHEET_SAVE = "google_sheet_save",
}

export interface AUTH {
  type: string;
  project_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}
export interface GOOGLE {
  AUTH: AUTH;
  GOOGLE_KEY: string;
  SEARCH_ID: string;
  SHEET_DOC_ID: string;
}
