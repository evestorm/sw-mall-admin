'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.passport.authenticate('jwt', { session: false, successReturnToOrRedirect: null });
  router.get('/', controller.home.index);
  router.get('/test', controller.home.test);
  // admin
  router.post('/admin/login', controller.admin.user.login);
  router.post('/admin/register', controller.admin.user.register);
  router.get('/admin/user', jwt, controller.admin.user.user);
  router.get('/admin/category', jwt, controller.admin.category.getCategoryList);
  router.post('/admin/category/add', jwt, controller.admin.category.addCategory);
  router.post('/admin/category/edit/:ID', jwt, controller.admin.category.editCategory);
  router.post('/admin/category/delete/:ID', jwt, controller.admin.category.deleteCategory);
};
