import fs from 'fs'
let prefix = ''

const logger = {
  appendFile (msg, file = 'log') {
    try {
      const date = new Date().toISOString().split('T')[0]
      // eslint-disable-next-line no-undef
      const [mm, ss] = new Date().toISOString().split('T')[1].split(':')
      fs.appendFile(
        `out/log/${file}-${date}.txt`,
        `\n${mm}:${ss}\t${msg}`,
        (err) => {
          if (err) {
            // eslint-disable-next-line no-console
            console.log('Error write file: ', err)
            return err
          }
        }
      )
    } catch (error) {}
  },
  /**
   * Informar prefixo
   * @param {String} prefixo Prefixo
   */
  setPrefix (prefixo = false) {
    prefix = prefixo ? `[${prefixo}] ` : ''
  },

  /**
   * Log
   * @param {String} message Mensagem
   */
  log (message) {
    const msg = `${prefix}${message}`
    // eslint-disable-next-line no-console
    console.log(msg)
    // this.appendFile(msg);
  },

  /**
   * Info
   * @param {String} message Mensagem
   */
  info (message) {
    const msg = `Info: ${prefix}${message}`
    // eslint-disable-next-line no-console
    console.info(msg)
    this.appendFile(msg)
  },

  debug (message) {
    const msg = `Debug: ${prefix}${message}`
    // eslint-disable-next-line no-console
    console.debug(msg)
    this.appendFile(msg)
  },

  warn (message) {
    const msg = `Warn: ${prefix}${message}`
    // eslint-disable-next-line no-console
    console.warn(msg)
    this.appendFile(msg)
  },

  error (message) {
    const msg = `Error: ${prefix}${message}`
    // eslint-disable-next-line no-console
    console.error(msg)
    this.appendFile(msg)
  }
}

module.exports = logger
