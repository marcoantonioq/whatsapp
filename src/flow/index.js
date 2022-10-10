const flows = [
    {
        name: "createMsgsToGroup",
        nodes: [
            (el) => {
                const paraAPI = el.msg.to === '120363042441548855@g.us'
                const enviarMSG = el.msg.body.match(/(send |mensagem |msg )(para |)(.*)$/gi)
                if (paraAPI && enviarMSG) {
                    el.msg = 'msg1 de teste /'
                    return el;
                }
            },
            (el) => {
                el.msg = `msg2 + ${el.msg}`
                el.exec = (msg) => console.log(msg)
                el.value = 1
                return el;
            }
        ]
    },
]

const mock = {
    msg: {
        to: '120363042441548855@g.us',
        body: 'send para teste'
    }
}

const result = flows[0].nodes.reduce((data, func) => {
    if (data) {
        return func(data)
    }
    throw 'Não aplica!'
}, mock)

console.log(`Result: ${JSON.stringify(result)}`);

module.exports = flows