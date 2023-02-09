import { Module as ModuleType } from "@types";

export class Module implements ModuleType {
  async initialize(app: import("events")): Promise<Boolean> {
    return true;
  }
}
