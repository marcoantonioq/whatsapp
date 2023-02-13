import EventEmitter from "events";
import * as puppeteer from "puppeteer";

export interface Module {
  initialize(app: EventEmitter): Promise<any>;
}

export interface WhatsappSettings {
  clientId: string;
  puppeteer: puppeteer.PuppeteerNodeLaunchOptions & puppeteer.ConnectOptions;
}

export enum EventsApp {
  READY = "ready",
  UPDATE_CONTACT = "update-contact",
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
