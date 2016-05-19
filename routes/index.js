const   express = require('express'),
        router  = express.Router(),
        config  = require('config');

const IndexController  = require('../controllers');
const auth = require('../middleware/auth.js');

router.get('/api/v1/token', IndexController.getToken.bind(IndexController));
router.get('/api/v1/veiculos', auth, IndexController.getVeiculos.bind(IndexController));
router.get('/api/v1/allVeiculos', auth, IndexController.getAllVeiculos.bind(IndexController));
router.get('/api/v1/linha', auth, IndexController.getLinha.bind(IndexController));

module.exports = router;
