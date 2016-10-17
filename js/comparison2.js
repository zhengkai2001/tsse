// var phpUrl = 'http://localhost/tsse/fetch_article.php?';
var phpUrl = 'https://tsse.herokuapp.com/fetch_article.php?';

var nbrUrl = 'http://www.notebookreview.com/notebookreview/dell-xps-13-review-2016/';
var ltmUrl = 'http://www.laptopmag.com/reviews/laptops/dell-xps-13';
var nbcUrl = 'http://www.notebookcheck.net/Dell-XPS-13-9350-2016-FHD-i7-6560U-Notebook-Review.168175.0.html';

// specifically for notebookreview.com
function buildSectionNBR(content, section, part) {
    var str = '';
    var ps = $(content).parent().nextUntil('h1, h2', 'p');
    ps.each(function (index2, p) {
        str += $(p).html();
    });
    $(part + '-1').append('<h4>' + section + '</h4>' + str);
}

// specifically for laptopmag.com
function buildSectionLTM(content, section, part) {
    var str = '';
    var ps = $(content).nextUntil('h3', 'p');
    ps.each(function (index2, p) {
        str += $(p).html();
    });
    $(part + '-2').append('<h4>' + section + '</h4>' + str);
}

// specifically for notebookcheck.com
function buildSectionNBC(content, section, part) {
    var str = '';

    //<h2>Case</h2></div> <div> <div></div> <div class="csc-textpic-text"><p
    var ps = $(content).parent().next().find('div.csc-textpic-text');
    ps.each(function (index2, p) {
        str += $(p).html();
    });

    //<h2>Connectivity</h2></div></div> <div> <div class="csc-textpic-text">
    if (str == '') {
        ps = $(content).parent().parent().next().find('div.csc-textpic-text');
        ps.each(function (index2, p) {
            str += $(p).html();
        });
    }

    //<h3>Speakers</h3></div> <div class="csc-textpic-text">
    if (str == '') {
        ps = $(content).parent().next('div.csc-textpic-text');
        ps.each(function (index2, p) {
            str += $(p).html();
        });
    }

    //<h2>Display</h2></div></div> <div><div></div></div> <div><div class="csc-textpic-text">
    if (str == '') {
        ps = $(content).parent().parent().next().next().find('div.csc-textpic-text');
        ps.each(function (index2, p) {
            str += $(p).html();
        });
    }

    //<div class="csc-textpic-text"><h3>Keyboard</h3><p
    if (str == '') {
        ps = $(content).nextUntil('h2, h3', 'p');
        ps.each(function (index2, p) {
            str += $(p).html();
        });
    }

    //<h3>Power Consumption</h3></div><p
    if (str == '') {
        ps = $(content).parent().nextUntil('h2, h3', 'p');
        ps.each(function (index2, p) {
            str += $(p).html();
        });
    }

    $(part + '-3').append('<h4>' + section + '</h4>' + str);
}

$(document).ready(function () {
    // site 1: notebookreview
    var query1 = phpUrl + 'url=' + nbrUrl;
    $.get(query1, function (resultPage) {
        var doc = $.parseHTML(resultPage.toString());

        // var titleDiv = $(doc).find('div.breadcrumbs').html();
        // var lastIndexOfAnchor = titleDiv.lastIndexOf('</a>');
        // var title = titleDiv.substr(lastIndexOfAnchor + 10, titleDiv.length);
        var title = $(doc).filter('title').html();
        $('#link-1').append('<a href="' + nbrUrl + '" target = "_blank">' + title + '</a>');

        // var rating = $(doc).find('li.ratingsTotal li.ratingValue').html();
        var rating = $(doc).find('meta[itemprop="ratingValue"]').prop('content');
        var bestRating = $(doc).find('meta[itemprop="bestRating"]').prop('content');
        $('#rating-1').append(rating + ' / ' + bestRating);

        var pros_cons = $(doc).find('h2.title');
        var pros = $(pros_cons[0]).next()[0].outerHTML;
        $('#pros-1').append(pros);
        var cons = $(pros_cons[1]).next()[0].outerHTML;
        $('#cons-1').append(cons);

        var summary = $(doc).find('div.pf-content p').first();
        $('#summary-1').append(summary);

        var strongs = $(doc).find('strong');
        strongs.each(function (index, strong) {
            var section = $(strong).html();
            if (section === 'Build and Design') {
                buildSectionNBR(strong, section, '#design');

            } else if (section === 'Ports and Features') {
                buildSectionNBR(strong, section, '#ports');

            } else if (section === 'Screen and Speakers') {
                buildSectionNBR(strong, section, '#screen_speakers');

            } else if (section === 'Keyboard and Touchpad') {
                buildSectionNBR(strong, section, '#keyboard_touchpad');

            } else if (section === 'Performance'
                || section === 'Benchmarks') {
                buildSectionNBR(strong, section, '#performance');

            } else if (section === 'Heat and Noise') {
                buildSectionNBR(strong, section, '#emission');

            } else if (section === 'Battery Life') {
                buildSectionNBR(strong, section, '#longevity');

            } else if (section === 'Conclusion') {
                buildSectionNBR(strong, section, '#conclusion');
            }
        });
    });

    // site 2: laptopmag
    var query2 = phpUrl + 'url=' + ltmUrl;
    $.get(query2, function (resultPage) {
        var doc = $.parseHTML(resultPage.toString());

        var title = $(doc).filter('title').html();
        $('#link-2').append('<a href="' + ltmUrl + '" target = "_blank">' + title + '</a>');

        var rating = $(doc).find('meta[itemprop="ratingValue"]').prop('content');
        var bestRating = $(doc).find('meta[itemprop="bestRating"]').prop('content');
        $('#rating-2').append(rating + ' / ' + bestRating);

        var prosLi = $(doc).find('li.otmPros')[0];
        var prosText = $(prosLi).find('p').html();
        var prosStr = '<ul>';
        $(prosText.split(';')).each(function (index, pros) {
            prosStr += '<li>' + pros + '</li>';
        });
        prosStr += '</ul>';
        $('#pros-2').append(prosStr);

        var consLi = $(doc).find('li.otmCons')[0];
        var consText = $(consLi).find('p').html();
        var consStr = '<ul>';
        $(consText.split(';')).each(function (index, cons) {
            consStr += '<li>' + cons + '</li>';
        });
        consStr += '</ul>';
        $('#cons-2').append(consStr);

        var summarySection = $(doc).find('section.otm-content')[0];
        var summaryText = $(summarySection).find('p').html();
        $('#summary-2').append(summaryText);

        var hasVerdict = false;

        var hs = $(doc).find('h2, h3');
        hs.each(function (index, h) {
            var section = $(h).html();
            if (section === 'Design') {
                buildSectionLTM(h, section, '#design');

            } else if (section === 'Ports') {
                buildSectionLTM(h, section, '#ports');

            } else if (section === 'Display'
                || section === 'Audio') {
                buildSectionLTM(h, section, '#screen_speakers');

            } else if (section === 'Keyboard and Touchpad') {
                buildSectionLTM(h, section, '#keyboard_touchpad');

            } else if (section === 'Performance'
                || section === 'Graphics Performance') {
                buildSectionLTM(h, section, '#performance');

            } else if (section === 'Heat') {
                buildSectionLTM(h, section, '#emission');

            } else if (section === 'Battery Life') {
                buildSectionLTM(h, section, '#longevity');

            } else if (section === 'Verdict /' && !hasVerdict) {
                hasVerdict = true;
                section = "Verdict";
                buildSectionLTM(h, section, '#conclusion');
            }
        });
    });

    // site 3: notebookcheck
    var query3 = phpUrl + 'url=' + nbcUrl;
    $.get(query3, function (resultPage) {
        var doc = $.parseHTML(resultPage.toString());

        var title = $(doc).filter('title').html();
        $('#link-3').append('<a href="' + nbcUrl + '" target = "_blank">' + title + '</a>');

        var rating = $(doc).find('tspan#tspan4350').html();
        $('#rating-3').append(rating);

        $('#pros-3').append("Not provided");
        $('#cons-3').append("Not provided");

        var summarySection = $(doc).find('b')[0];
        var summaryText = $(summarySection).parent().html();
        $('#summary-3').append(summaryText);
        //
        var hs = $(doc).find('h2, h3');
        hs.each(function (index, h) {
            var section = $(h).html();
            if (section === 'Case') {
                buildSectionNBC(h, section, '#design');

            } else if (section === 'Connectivity') {
                buildSectionNBC(h, section, '#ports');

            } else if (section === 'Display') {
                buildSectionNBC(h, section, '#screen_speakers');

            } else if (section === 'Speakers') {
                buildSectionNBC(h, section, '#screen_speakers');

            } else if (section === 'Keyboard'
                || section === 'Touchpad') {
                buildSectionNBC(h, section, '#keyboard_touchpad');

            } else if (section === 'Processor'
                || section === 'System Performance'
                || section === 'Graphics Card'
                || section === 'Gaming Performance'
                || section === 'Storage Device') {
                buildSectionNBC(h, section, '#performance');

            } else if (section === 'System Noise'
                || section === 'Temperature') {
                buildSectionNBC(h, section, '#emission');

            } else if (section === 'Power Consumption') {
                buildSectionNBC(h, section, '#longevity');

            } else if (section === 'Verdict') {
                buildSectionNBC(h, section, '#conclusion');
            }
        });
    });
});

