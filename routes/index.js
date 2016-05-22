const   express = require('express'),
        router  = express.Router(),
        config  = require('config');

const IndexController  = require('../controllers');
const auth = require('../middleware/auth.js');

router.get('/api/v1/token', IndexController.getToken.bind(IndexController));
router.get('/api/v1/lines/', auth, IndexController.getAllLines.bind(IndexController));
router.get('/api/v1/vehicles/', auth, IndexController.getAllVehicles.bind(IndexController));
router.get('/api/v1/lines/:search', auth, IndexController.getLines.bind(IndexController));
router.get('/api/v1/vehicles/:code', auth, IndexController.getVehicles.bind(IndexController));

module.exports = router;
