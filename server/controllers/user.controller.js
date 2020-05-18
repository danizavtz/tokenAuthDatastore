const tipo = 'Pessoa'
exports.listUsers = async(req, res) => {
    const dbi = req.app.get('datastore')
    const queryusers = dbi.createQuery(tipo);
    const usuarios = await dbi.runQuery(queryusers);
    res.status(200).json(usuarios);
}