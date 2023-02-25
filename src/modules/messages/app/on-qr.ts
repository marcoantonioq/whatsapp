export class OnQR {
  constructor(private readonly repo?: any) {}

  async execute(listener: (qr: string) => void) {
    this.repo.event.on("qr", listener);
  }
}
export default OnQR;
