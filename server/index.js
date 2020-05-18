const router = require('express').Router();

router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({ errors: [{location: "server", msg: "Unauthorized", param: req.path}]});
    }
    next(err);
  });

router.get('/', (req, res) => {
    req.servermsg = {msg: "Server up and running"}
    res.status(200).json(req.servermsg)
});

//fallback 
router.get('*', (req, res) => {
    res.status(404).json({ errors: [{location: "server", msg: "Not found", param: req.path}]});
});

module.exports = router;