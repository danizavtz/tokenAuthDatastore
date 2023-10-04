const router = require('express').Router();
const userRoute = require('./routes/user.route');

router.use(userRoute)

router.get('/', (req, res) => {
    req.servermsg = {msg: "Server up and running"}
    res.status(200).json(req.servermsg)
});

//fallback 
router.get('*', (req, res) => {
    res.status(404).json({ errors: [{location: "server", msg: "Not found", param: req.path}]});
});

module.exports = router;