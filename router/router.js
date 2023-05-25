const { Router } = require('express');
const controller = require('../controller/controller');

router = Router()

router.get('/signup', controller.signup_get);
router.get('/logout', controller.logout);
router.get('/login', controller.login_get);
router.get('/additem', controller.additem_get);

router.post('/adduser', controller.addUser)
router.post('/additem', controller.addItem)
router.post('/login', controller.login_post)


module.exports = router