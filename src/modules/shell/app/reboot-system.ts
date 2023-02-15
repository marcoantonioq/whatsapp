import { InterfaceRepository, ShellLinux } from "../core/Shell";

export class RebootSystem {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute() {
    ShellLinux.exec("/sbin/reboot");
  }
}

export default RebootSystem;
