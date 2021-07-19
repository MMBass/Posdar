var express = require('express');
var router = express.Router();
const registerController  = require('../controllers/registerController');

/* POST json object. */
router.post('/',registerController.newRegister);

/* DELETE json object. */
router.delete('/', registerController.delRegister);

module.exports = router;