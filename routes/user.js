const express = require('express');
const router = express.Router();


const userCtrl = require('../controllers/user');

const bouncer = require('express-bouncer')(500, 900000);

const verifyPassword = require('../middleware/verifyPassword')

router.post('/signup', verifyPassword, userCtrl.signup);
router.post('/login', bouncer.block, userCtrl.login);

module.exports = router;