/*jslint node: true*/
/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', { title: 'RaspCam Pic' });
};
