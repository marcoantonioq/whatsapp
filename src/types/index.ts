import EventEmitter from "events";
import * as puppeteer from "puppeteer";

export interface Module {
  id: string;
  initialize(app: EventEmitter): Promise<any>;
}

export interface WhatsappSettings {
  MY_NUMBER: string;
  clientId: string;
  GROUP_API: string;
  puppeteer: puppeteer.PuppeteerNodeLaunchOptions & puppeteer.ConnectOptions;
}

export enum EventsApp {
  READY = "ready",
  REBOOT = "reboot",
  MESSAGES = "messages",
  MESSAGE_CREATE = "message_create",
  CONTACTS_GET = "get_contact",
  CONTACTS_UPDATE = "update_contact",
  SEND_API = "send_api",
  STATUS = "app_status",
}

export enum EventsWhatsapp {
  AUTHENTICATED = "authenticated",
  AUTHENTICATION_FAILURE = "auth_failure",
  READY = "ready",
  MESSAGE_RECEIVED = "message",
  MESSAGE_CREATE = "message_create",
  MESSAGE_REVOKED_EVERYONE = "message_revoke_everyone",
  MESSAGE_REVOKED_ME = "message_revoke_me",
  MESSAGE_ACK = "message_ack",
  MEDIA_UPLOADED = "media_uploaded",
  GROUP_JOIN = "group_join",
  GROUP_LEAVE = "group_leave",
  GROUP_UPDATE = "group_update",
  QR_RECEIVED = "qr",
  LOADING_SCREEN = "loading_screen",
  DISCONNECTED = "disconnected",
  STATE_CHANGED = "change_state",
  BATTERY_CHANGED = "change_battery",
  REMOTE_SESSION_SAVED = "remote_session_saved",
  CALL = "call",
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
