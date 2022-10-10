const filterAPI = (el) => el.msg.to === '120363042441548855@g.us' ? el : null;

const flows = [
    {
        name: "createMsgsToGroup",
        nodes: [
            filterAPI,
            function enviarMSG(el) {
                const enviarMSG = el.msg.body.match(/(send |mensagem |msg )(para |)(.*)$/gi)
                if (enviarMSG) {
                    el.msg = 'msg1 de teste /'
                    return el;
                }
            },
            (el) => {
                el.msg = `msg2 + ${el.msg}`
                el.value = 1
                el.run = () => {
                    console.log(el)
                }
                return el;
            },
        ]
    },
]

const mock = {
    msg: {
        to: '120363042441548855@g.us',
        body: 'send para teste'
    }
}

const result = flows.map(flow => {
    return flow.nodes.reduce((data, func) => {
        if (data) {
            return func(data)
        }
    }, mock)
})

result.forEach(async el => {
    try {
        el.run()
    } catch (e) {
        console.log(`Erros flows: ${e}`)
    }
})

module.exports = flows