import { InterfaceRepository } from "../interfaces/InterfaceRepository";

export class StateWhatsapp {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(state: string, session?: string) {
    //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
    console.log(`Session (${session}): ${state}`);
    // if (statusSession === "browserClose") {
    //   reject("Navegador fechado!!!");
    // }
    const disconnect = ["DISCONNECTED", "browserClose", "qrReadFail"].includes(
      state
    );
    if (disconnect) {
      console.log("Disconnect: ", state);
    }
  }
}
export default StateWhatsapp;
