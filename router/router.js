const { Router } = require('express');
const controller = require('../controller/controller');
const {requireAuth} = require('../middleware/authmiddleware');

router = Router()

router.get('/signup',  controller.signup_get);
router.get('/logout', controller.logout);
router.get('/login', controller.login_get);
router.get('/additem', requireAuth, controller.additem_get);
router.get('/home', requireAuth, controller.home);

router.post('/adduser', controller.addUser)
router.post('/additem', controller.addItem)
router.post('/login', controller.login_post)

router.get('/:id', controller.user);


module.exports = router