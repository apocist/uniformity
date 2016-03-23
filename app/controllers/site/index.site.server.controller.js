//Only loads a default page. Replace by marking a Routable with a '/' URL
exports.render = function(req, res) {
	res.render('site/index.swig', {
		title: 'Uniformity Frontpage'
	});
};