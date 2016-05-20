const   express = require('express'),
        router  = express.Router(),
        config  = require('config');

const IndexController  = require('../controllers');
const auth = require('../middleware/auth.js');

router.get('/api/v1/token', IndexController.getToken.bind(IndexController));
router.get('/api/v1/lines/:search', auth, IndexController.getSingleOrAllLines.bind(IndexController));
router.get('/api/v1/vehicles/:code', auth, IndexController.getSingleOrAllVehicles.bind(IndexController));

module.exports = router;
