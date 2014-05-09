
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('main', { title: 'Express' });
};
