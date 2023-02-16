import { InterfaceRepository, ShellLinux } from "../core/Shell";

export class RebootSystem {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute() {
    process.exit(0);
    // ShellLinux.exec("systemctl reboot");
  }
}

export default RebootSystem;
