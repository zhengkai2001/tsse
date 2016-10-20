// specifically for notebookreview.com
function buildSectionNBR(content, section, part, numStr) {
    var str = '';
    var ps = $(content).parent().nextUntil('h1, h2', 'p');
    ps.each(function (index2, p) {
        str += $(p).html();
    });
    $(part + '-' + numStr).append('<h4>' + section + '</h4>' + str);
}

// specifically for laptopmag.com
function buildSectionLTM(content, section, part, numStr) {
    var str = '';
    var ps = $(content).nextUntil('h3', 'p');
    ps.each(function (index2, p) {
        str += $(p).html();
    });
    $(part + '-' + numStr).append('<h4>' + section + '</h4>' + str);
}

// specifically for notebookcheck.com
function buildSectionNBC(content, section, part, numStr) {
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

    $(part + '-' + numStr).append('<h4>' + section + '</h4>' + str);
}

function getArticleFromNBR(url, number) {
    var numStr = number.toString();

    var query = phpUrl + 'fetch&url=' + url;
    $.get(query, function (resultPage) {
        var doc = $.parseHTML(resultPage.toString());

        var title = $(doc).filter('title').html();
        $('#link-' + numStr).append('<a href="' + url + '" target = "_blank">' + title + '</a>');

        // var rating = $(doc).find('li.ratingsTotal li.ratingValue').html();
        var rating = $(doc).find('meta[itemprop="ratingValue"]').prop('content');
        var bestRating = $(doc).find('meta[itemprop="bestRating"]').prop('content');

        if (rating == null) {
            rating = $(doc).find('li.ratingsTotal ul li.ratingValue').text().trim();
            bestRating = '10';
        }

        if (rating == null) {
            $('#rating-' + numStr).append('Not provided');
        } else {
            $('#rating-' + numStr).append(rating + ' / ' + bestRating);
        }

        var pros_cons = $(doc).find('h2.title');
        var pros = $(pros_cons[0]).next()[0].outerHTML;
        $('#pros-' + numStr).append(pros);
        var cons = $(pros_cons[1]).next()[0].outerHTML;
        $('#cons-' + numStr).append(cons);

        var summary = $(doc).find('div.pf-content p').first();
        $('#summary-' + numStr).append(summary);

        var strongs = $(doc).find('strong,h1,h2');
        strongs.each(function (index, strong) {
            var section = $(strong).html();
            if (section === 'Build and Design') {
                buildSectionNBR(strong, section, '#design', numStr);

            } else if (section === 'Ports and Features') {
                buildSectionNBR(strong, section, '#ports', numStr);

            } else if (section === 'Screen and Speakers') {
                buildSectionNBR(strong, section, '#screen_speakers', numStr);

            } else if (section === 'Keyboard and Touchpad') {
                buildSectionNBR(strong, section, '#keyboard_touchpad', numStr);

            } else if (section === 'Performance'
                || section === 'Benchmarks') {
                buildSectionNBR(strong, section, '#performance', numStr);

            } else if (section === 'Heat and Noise') {
                buildSectionNBR(strong, section, '#emission', numStr);

            } else if (section === 'Battery Life') {
                buildSectionNBR(strong, section, '#longevity', numStr);

            } else if (section === 'Conclusion') {
                buildSectionNBR(strong, section, '#conclusion', numStr);
            }
        });
    });
}

function getArticleFromLTM(url, number) {
    var numStr = number.toString();

    var query = phpUrl + 'fetch&url=' + url;
    $.get(query, function (resultPage) {
        var doc = $.parseHTML(resultPage.toString());

        var title = $(doc).filter('title').html();
        $('#link-' + numStr).append('<a href="' + url + '" target = "_blank">' + title + '</a>');

        var rating = $(doc).find('meta[itemprop="ratingValue"]').prop('content');
        var bestRating = $(doc).find('meta[itemprop="bestRating"]').prop('content');
        $('#rating-' + numStr).append(rating + ' / ' + bestRating);

        var prosLi = $(doc).find('li.otmPros')[0];
        var prosText = $(prosLi).find('p').html();
        var prosStr = '<ul>';
        $(prosText.split(';')).each(function (index, pros) {
            prosStr += '<li>' + pros + '</li>';
        });
        prosStr += '</ul>';
        $('#pros-' + numStr).append(prosStr);

        var consLi = $(doc).find('li.otmCons')[0];
        var consText = $(consLi).find('p').html();
        var consStr = '<ul>';
        $(consText.split(';')).each(function (index, cons) {
            consStr += '<li>' + cons + '</li>';
        });
        consStr += '</ul>';
        $('#cons-' + numStr).append(consStr);

        var summarySection = $(doc).find('section.otm-content')[0];
        var summaryText = $(summarySection).find('p').html();
        $('#summary-' + numStr).append(summaryText);

        var hasVerdict = false;

        var hs = $(doc).find('h2, h3');
        hs.each(function (index, h) {
            var section = $(h).html();
            if (section === 'Design') {
                buildSectionLTM(h, section, '#design', numStr);

            } else if (section === 'Ports') {
                buildSectionLTM(h, section, '#ports', numStr);

            } else if (section === 'Display'
                || section === 'Audio') {
                buildSectionLTM(h, section, '#screen_speakers', numStr);

            } else if (section === 'Keyboard and Touchpad') {
                buildSectionLTM(h, section, '#keyboard_touchpad', numStr);

            } else if (section === 'Performance'
                || section === 'Graphics Performance') {
                buildSectionLTM(h, section, '#performance', numStr);

            } else if (section === 'Heat') {
                buildSectionLTM(h, section, '#emission', numStr);

            } else if (section === 'Battery Life') {
                buildSectionLTM(h, section, '#longevity', numStr);

            } else if (section === 'Verdict /' && !hasVerdict) {
                hasVerdict = true;
                section = "Verdict";
                buildSectionLTM(h, section, '#conclusion', numStr);
            }
        });
    });
}

function getArticleFromNBC(url, number) {
    var numStr = number.toString();

    var query = phpUrl + 'fetch&url=' + url;
    $.get(query, function (resultPage) {
        var doc = $.parseHTML(resultPage.toString());

        var title = $(doc).filter('title').html();
        $('#link-' + numStr).append('<a href="' + url + '" target = "_blank">' + title + '</a>');

        var rating = $(doc).find('tspan#tspan4350').html();
        $('#rating-' + numStr).append(rating);

        $('#pros-' + numStr).append("Not provided");
        $('#cons-' + numStr).append("Not provided");

        var summarySection = $(doc).find('b')[0];
        var summaryText = $(summarySection).parent().html();
        $('#summary-' + numStr).append(summaryText);
        //
        var hs = $(doc).find('h2, h3');
        hs.each(function (index, h) {
            var section = $(h).html();
            if (section === 'Case') {
                buildSectionNBC(h, section, '#design', numStr);

            } else if (section === 'Connectivity') {
                buildSectionNBC(h, section, '#ports', numStr);

            } else if (section === 'Display') {
                buildSectionNBC(h, section, '#screen_speakers', numStr);

            } else if (section === 'Speakers') {
                buildSectionNBC(h, section, '#screen_speakers', numStr);

            } else if (section === 'Keyboard'
                || section === 'Touchpad') {
                buildSectionNBC(h, section, '#keyboard_touchpad', numStr);

            } else if (section === 'Processor'
                || section === 'System Performance'
                || section === 'Graphics Card'
                || section === 'Gaming Performance'
                || section === 'Storage Device') {
                buildSectionNBC(h, section, '#performance', numStr);

            } else if (section === 'System Noise'
                || section === 'Temperature') {
                buildSectionNBC(h, section, '#emission', numStr);

            } else if (section === 'Power Consumption') {
                buildSectionNBC(h, section, '#longevity', numStr);

            } else if (section === 'Verdict') {
                buildSectionNBC(h, section, '#conclusion', numStr);
            }
        });
    });
}