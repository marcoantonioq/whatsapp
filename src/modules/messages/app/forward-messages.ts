interface params {
  number: string;
  msgs_id: string[];
}

export class ForwardMessages {
  constructor(private readonly repo?: any) {}

  async execute(params: params) {
    console.log("Encaminhar novas mensagens: ", params);
  }
}
export default ForwardMessages;
