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
  SPEECH_ID: string;
  SEARCH_ID: string;
  SHEET_DOC_ID: string;
}

export enum Events {
  AUTHENTICATED = "authenticated",
}
