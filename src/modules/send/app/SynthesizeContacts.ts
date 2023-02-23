import { Contato } from "@modules/contacts/core/Contacts";

interface props {
  text: string;
}

interface result {
  contacts: Contato[];
}

export class SynthesizeContacts {
  constructor(private readonly repo?: any) {}

  async execute(msgs: props): Promise<result> {
    return { contacts: [] };
  }
}

export default SynthesizeContacts;
