import what from 'whatsapp-web.js'

interface whatsapp extends what.Client, what { }

export type state = {
    count: Number,
    logger: {
        appendFile(msg: what.Message, file: String): Promise<string>,
        setPrefix(prefixo: String): void,
        log(message: String): void,
        info(message: String): void,
        debug(message: String): void,
        warn(message: String): void,
        error(message: String): void,
    },
    contatos: {
        store: Array.<{ _NOME: String, _NOTAS: String, _TELEFONES: String, _DATES: String, _GRUPOS: String, _ID: String }>,
        rows: Array.<{ _NOME: String, _NOTAS: String, _TELEFONES: String, _DATES: String, _GRUPOS: String, _ID: String }>,
        groups: Array.<{ _GRUPOS: String }>,
    },
    api: {
        id: String,
        my: String,
        confirmed: Boolean,
        sendMessage: Function,
        reply: Function,
        status: {
            authenticated: Boolean,
            auth_failure: Boolean,
            ready: Boolean
        }
    },
    whatsapp: whatsapp
};