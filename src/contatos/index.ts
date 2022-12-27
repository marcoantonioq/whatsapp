import db from '../data'
import { sheet } from '../google/sheets'
import { format } from '../phone'

export class Contato {
  address: string = ""
  aniversario: Date | null = null
  email: string = ""
  favorito: boolean = false
  foto: any
  id: string = ""
  nome: string = ""
  notas: string = ""
  private _grupos: string[] = []
  private _telefones: string[] = []

  constructor(params: Partial<Contato>) {
    Object.assign(this, params)
  }

  get data() {
    return {
      address: this.address,
      aniversario: this.aniversario?.toLocaleString(),
      id: this.id,
      nome: this.nome,
      email: this.email,
      notas: this.notas,
      telefones: this.telefones.join(','),
      grupos: this.grupos.join(',')
    }
  }

  get grupos() {
    return this._grupos
  }

  set grupos(grupos) {
    this._grupos = grupos.map(el => el.trim())
  }

  get telefones() {
    return this._telefones
  }

  set telefones(telefones) {
    this._telefones = telefones.map(telefone => {
      try {
        return format(telefone)
      } catch (e) {
        return ""
      }
    }).filter(phone => phone !== "")
  }

  async save() {
    await db.contatos.upsert({
      where: { id: this.id },
      update: this.data,
      create: this.data,
    })
  }

}

export class Agenda {
  contatos: Contato[] = []
  grupos: string[] = []
  async update() {
    const convertDataToContatos = (data: any) => {
      const { nome, notas, telefones, aniversario, grupos, address, id } = data
      const gp = grupos.split(',').map((el: string) => el.trim()).filter((el: string) => el)
      gp.forEach(async (el: string) => {
        if (!this.grupos.includes(el)) {
          this.grupos.push(el)
        }
      });
      return new Contato({ id, nome, notas, telefones: telefones.split(','), aniversario: aniversario || null, grupos: gp, address })
    }
    try {
      this.contatos = (await sheet.getRows("Contatos"))
        .map(({ _rawData }) => _rawData)
        .filter(([nome]) => nome)
        .map(([nome, notas, telefones, aniversario, grupos, address, id]) => {
          const contato = convertDataToContatos({ id, nome, notas, telefones, aniversario, grupos, address })
          contato.save()
          return contato
        })
      this.save()
    } catch (e) {
      this.contatos = (await db.contatos.findMany()).map(convertDataToContatos)
      this.grupos = (await db.grupos.findMany()).map(({ nome }) => nome)
      console.log(this.grupos, "\nRecuperado dados do banco de dados!\nErro: ", e)
    }
  }

  async save() {
    this.grupos.forEach(async el => {
      const data = { nome: el }
      await db.grupos.upsert({
        where: data,
        update: data,
        create: data,
      })
    })

  }
}

export const agenda = new Agenda()
agenda.update()
setInterval(agenda.update, 60 * 60 * 1000)

