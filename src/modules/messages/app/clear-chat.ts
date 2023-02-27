export class ClearChat {
  constructor(private readonly repo?: any) {}

  async execute(chatID: string) {
    this.repo.clearChat(chatID);
  }
}
export default ClearChat;
