var phpUrl = 'http://localhost/tsse/utils.php?';
// var phpUrl = 'https://tsse.herokuapp.com/utils.php?';

var nbrUrl = 'http://www.notebookreview.com/notebookreview/dell-xps-13-review-2016/';
var ltmUrl = 'http://www.laptopmag.com/reviews/laptops/dell-xps-13';
var nbcUrl = 'http://www.notebookcheck.net/Dell-XPS-13-9350-2016-FHD-i7-6560U-Notebook-Review.168175.0.html';

$(document).ready(function () {
    // site 1: notebookreview
    getArticleFromNBR(nbrUrl, 1);

    // site 2: laptopmag
    getArticleFromLTM(ltmUrl, 2);

    // site 3: notebookcheck
    getArticleFromNBC(nbcUrl, 3);
});

