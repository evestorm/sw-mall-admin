'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.passport.authenticate('jwt', { session: false, successReturnToOrRedirect: null });
  // 商城
  router.get('/', controller.home.index);
  router.get('/index', controller.home.index);
  router.post('/login', controller.user.login);
  router.post('/register', controller.user.register);
  router.get('/user', jwt, controller.user.user);
  router.post('/goods/list', controller.admin.goods.getGoodsListByCategorySubID);
  // 后台管理
  router.post('/admin/login', controller.admin.admin.login);
  router.post('/admin/register', controller.admin.admin.register);
  router.get('/admin/user', jwt, controller.admin.admin.admin);
  router.get('/admin/siteinfo', jwt, controller.admin.site.getSiteInfo);
  router.get('/admin/category', controller.admin.category.getCategoryList);
  router.post('/admin/category/add', jwt, controller.admin.category.addCategory);
  router.post('/admin/category/edit/:cate_id', jwt, controller.admin.category.editCategory);
  router.post('/admin/category/delete/:cate_id', jwt, controller.admin.category.deleteCategory);
  router.post('/admin/form/upload', jwt, controller.admin.form.upload);
  router.get('/admin/goods', jwt, controller.admin.goods.getGoodsList);
  router.get('/admin/goods/detail/:ID', jwt, controller.admin.goods.getGoodsDetail);
  router.post('/admin/goods/add', jwt, controller.admin.goods.addGoods);
  router.post('/admin/goods/edit/:ID', jwt, controller.admin.goods.editGoods);
  router.post('/admin/goods/delete/:ID', jwt, controller.admin.goods.deleteGoods);
};
