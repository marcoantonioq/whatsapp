import what from 'whatsapp-web.js'
import { Observable } from '../observers';

interface APP {
    app: what.Client
}

interface IObservers {
    message: Observable;
    ready: Observable;
    create: Observable;
    qrCode: Observable;
    group: Observable;
    disconnected: Observable;
}

interface whatsAppWeb extends what {

}

interface whatsapp extends APP, IObservers, whatsAppWeb { }

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
    whatsapp: whatsapp
};