export class OnCreate {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(msg: any) {
    console.log("Nova mensagem criada: ", msg);
    this.repo.add(msg);
  }
}
export default OnCreate;
