import { InterfaceRepository, ShellLinux } from "../core/Shell";
import qrConsole from "qrcode-terminal";

export class QrConsole {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(qr: string) {
    qrConsole.generate(qr, { small: true });
  }
}

export default QrConsole;
