var express = require('express');
var router = express.Router();
const registerController  = require('../controllers/registerController');

router.get('/',registerController.getList);

router.post('/',registerController.newRegister);

router.delete('/', registerController.delRegister);

module.exports = router;