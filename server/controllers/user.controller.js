const tipo = 'Pessoa'
exports.listUsers = async (req, res) => {
    try {
        const dbi = req.app.get('datastore')
        const queryusers = dbi.createQuery(tipo);
        const usuarios = await dbi.runQuery(queryusers);
        res.status(200).json(usuarios);
    } catch (e) {
        res.status(500).json({ errors: [{ location: req.path, msg: e.message, param: null }] })
    }
}

exports.findUserById = async (req, res, next) => {
    try {
        const dbi = req.app.get('datastore')
        const chave = dbi.key([tipo, Number(req.params.id)]);
        const usuario = await dbi.get(chave)
        if (usuario[0] === undefined) {
            return res.status(404).json({ errors: [{ location: req.path, msg: "Not found", param: req.params.id }] })
        }
        req.usuario = usuario
        res.status(200).json(req.usuario);
    } catch (e) {
        res.status(500).json({ errors: [{ location: req.path, msg: e.message, param: null }] })
    }
}

exports.criarUsuario = async (req, res) => {
    try {
        const dbi = req.app.get('datastore')
        const chaveusuario = dbi.key(tipo)
        const entidadeUsuario = {
            key: chaveusuario,
            data: [req.body]
        }
        await dbi.save(entidadeUsuario)
        res.set('location', `/users/${chaveusuario.id}`)
        res.status(201).end()
    } catch (e) {
        res.status(500).json({ errors: [{ location: req.path, msg: e.message, param: null }] })
    }
}

exports.atualizar = async (req, res) => {
    try {
        const dbi = req.app.get('datastore')
        const chave = dbi.key([tipo, Number(req.params.id)])
        const usuario = await dbi.get(chave);
        const mergedObj = { ...usuario, ...req.body }; //aqui a ordem é importante, estou priorizando as changes do body sobreescrevendo dados em comum que estão no datastore
        dbi.save({ key: chave, data: [mergedObj] });
        res.status(204).end()
    } catch (e) {
        res.status(500).json({ errors: [{ location: req.path, msg: e.message, param: null }] })
    }
}

exports.apagar = async (req, res) => {
    try {
        const dbi = req.app.get('datastore')
        const chave = dbi.key([tipo, Number(req.params.id)])
        await dbi.delete(chave)
        res.status(204).end()
    } catch (e) {
        res.status(500).json({ errors: [{ location: req.path, msg: e.message, param: null }] })
    }
}