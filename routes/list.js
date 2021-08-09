var express = require('express');
var router = express.Router();
const listController  = require('../controllers/listController');

router.post('/',listController.getList);

module.exports = router;