import { InterfaceRepository, Message } from "../core/Message";

export class DownloadMedia {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(messageID: string) {
    const strBase64 = await this.repo.download(messageID);
    const data = strBase64.split(";base64,");
    return {
      type: data[0],
      data: data[1],
    };
  }
}
export default DownloadMedia;
