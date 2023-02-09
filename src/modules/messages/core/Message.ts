interface InterfaceRepository {
  index(): Promise<[]>;
  add(msg: any): Promise<Boolean>;
}
