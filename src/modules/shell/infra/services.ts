import QrCodeConsole from "../app/qr-code";
import RebootSystem from "../app/reboot-system";
import RepoShell from "./repo-mem";

const repo = new RepoShell([]);

export const rebootSystem = new RebootSystem(repo);
export const qrCodeConsole = new QrCodeConsole(repo);
