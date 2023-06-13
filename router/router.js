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
router.post('/comment', controller.comment)
router.get('/posts/:id', controller.browse)
router.get('/:id', controller.user);
router.delete('/:id',controller.item_delete)


module.exports = router