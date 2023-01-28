export class Validation {
  to: string;
  private regex: RegExp | undefined;
  private sanitizer: Function | undefined;
  private validation: Function | undefined;
  private message: string | undefined = "Valor inválido!";
  private _value: any;
  constructor({
    to,
    regex,
    sanitizer,
    validation,
    message,
    value,
  }: {
    to: string;
    message?: string;
    regex?: RegExp;
    sanitizer?: Function;
    validation?: Function;
    value?: any;
  }) {
    this.to = to;
    this.value = value;
    this.regex = regex;
    this.sanitizer = sanitizer;
    this.validation = validation;
    this.message = message;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = this.sanitizer ? this.sanitizer(value) : value;
  }

  valid(value: any) {
    this.value = value;
    if (this.regex)
      if (!`${this.value}`.match(this.regex))
        throw new Error(
          `Expressão ${this.to} ${this.regex} => ${this.value}: ${
            this.message || "Valor inválido!"
          }`
        );
    if (this.validation)
      if (!this.validation(this.value))
        throw new Error(
          `Validação ${this.value}: ${this.message || "Valor inválido!"}`
        );
  }
}
