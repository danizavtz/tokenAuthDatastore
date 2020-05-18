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
        console.log(req.params)
        const chave = dbi.key([tipo, Number(req.params.id)]);
        const usuario = await dbi.get(chave)
        if (usuario[0] === undefined) {
            return res.status(404).json({ errors: [{ location: req.path, msg: "Not found", param: req.params.id }] })
        }
        req.usuario = usuario
        res.status(200).json(req.usuario);
    } catch (e) {
        console.log('pff')
        res.status(500).json({ errors: [{ location: req.path, msg: e.message, param: null }] })
    }
}

exports.criarUsuario = async (req, res) => {
    try {
        const dbi = req.app.get('datastore')
        const chaveusuario = dbi.key(tipo)
        const entidadeUsuario = {
            key: chaveusuario,
            data: [
                req.body
            ]
        }
        await dbi.save(entidadeUsuario)
        res.set('location', `/users/${chaveusuario.id}`)
        res.status(201).end()
    } catch (e) {
        res.status(500).json({ errors: [{ location: req.path, msg: e.message, param: null }] })
    }
}

exports.atualizar = async (req, res) => {
    const dbi = req.app.get('datastore')
    const transaction = dbi.transaction();
    try {
        const dbi = req.app.get('datastore')
        const chave = dbi.key([tipo, Number(req.params.id)])
        const transaction = dbi.transaction();
        const [usuario] = await transaction.get(chave);
        transaction.save({ key: chave, data: req.body });
        await transaction.commit();
        res.status(204).end()
    } catch (e) {
        transaction.rollback();
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