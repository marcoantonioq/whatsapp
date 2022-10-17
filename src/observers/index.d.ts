export interface Observable {
  subscribe(f: Function): void;
  unsubscribe(f: Function): void;
  notify(params: any): void
}