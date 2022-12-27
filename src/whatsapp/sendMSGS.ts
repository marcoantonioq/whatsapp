import { app } from './whatsapp'

class MSG {
  to: string
  text: string
  constructor(to: string, text: string) {
    this.to = to
    this.text = text
  }
  sendMessage() {
    app.sendMessage(this.to, this.text)
  }
}

const msgs: MSG[] = []

app.on('ready', async () => {
  console.log('ENVIAR MENSAGEM...')
  for (const msg of msgs) {
    try {
    } catch (e) {
      console.log(`to: ${msg.to};\tErro: ${e}`)
    }
  }
})
