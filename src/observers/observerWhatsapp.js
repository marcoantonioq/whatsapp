/**
 * TypeScript message
 * @typedef { import("../store/state").state } state
 * @typedef { import("whatsapp-web.js").Message } msg
 */

class Observable {
  // cada instância da classe Observer
  // começa com um array vazio de observadores/observers
  // que reagem a uma mudança de estado
  constructor() {
    this.observers = [];
  }

  // adicione a capacidade de inscrever um novo objeto / Elemento DOM
  // essencialmente, adicione algo ao array de observadores
  subscribe(f) {
    this.observers.push(f);
    return this;
  }

  // adicione a capacidade de cancelar a inscrição de um objeto em particular
  // essencilamente, remove algum item do array de observadores
  unsubscribe(f) {
    this.observers = this.observers.filter((subscriber) => subscriber !== f);
    return this;
  }

  /**
 * Atualiza todas as funções subscribe
 * @param {state} state Estado da aplicação
 * @param {msg} msg Whatsapp message
 */
  notify(state, msg) {
    this.observers.forEach((observer) => {
      try {
        observer(state, msg)
      } catch (e) {
        console.log(`Erro: ${e}`)
      }
    });
    return this;
  }
}

module.exports = Observable;