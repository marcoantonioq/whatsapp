import EventEmitter from "events";

export interface Module {
  initialize(app: EventEmitter): Promise<any>;
}

export interface WhatsappSettings {
  clientId: string;
  puppeteer: {
    executablePath: string | null;
    args: Array<
      | "--disable-default-apps"
      | "--disable-extensions"
      | "--disable-setuid-sandbox"
      | "--enable-features=NetworkService"
      | "--ignore-certificate-errors"
      | "--ignore-certificate-errors-spki-list"
      | "--no-default-browser-check"
      | "--no-experiments"
      | "--no-sandbox"
      | "--disable-3d-apis"
      | "--disable-accelerated-2d-canvas"
      | "--disable-accelerated-jpeg-decoding"
      | "--disable-accelerated-mjpeg-decode"
      | "--disable-accelerated-video-decode"
      | "--disable-app-list-dismiss-on-blur"
      | "--disable-canvas-aa"
      | "--disable-composited-antialiasing"
      | "--disable-gl-extensions"
      | "--disable-gpu"
      | "--disable-histogram-customizer"
      | "--disable-in-process-stack-traces"
      | "--disable-site-isolation-trials"
      | "--disable-threaded-animation"
      | "--disable-threaded-scrolling"
      | "--disable-webgl"
    >;
  };
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
