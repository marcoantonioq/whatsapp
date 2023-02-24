export class StateMessages {
  constructor(private readonly repo?: any) {}

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
export default StateMessages;
