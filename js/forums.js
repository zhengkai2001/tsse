// This js parses review articles from 3 different review sites,
// and provides functions for other js files.

function appendContent(part, numStr, title, content) {
    var id = part + '-' + numStr;
    var collapseClass = part.substring(1) + '-collapse';

    $(id).append('<div class="' + collapseClass + '" class="collapse"><h4>' + title + '</h4>' + content + '</div>');
    // $(id).append('<h4>' + title + '</h4>' + content + '</div>');
}

function getContentFromPs(ps) {
    var content = '';
    ps.each(function (index, p) {
        content += $(p).html();
    });
    return content;
}

// specifically for notebookreview.com
function buildSectionNBR(originalContent, title, part, numStr) {
    var ps = $(originalContent).parent().nextUntil('h1, h2', 'p');
    var content = getContentFromPs(ps);

    //<h1></h1> <p></p><p></p>
    if (content == '') {
        ps = $(originalContent).nextUntil('h1, h2', 'p');
        content = getContentFromPs(ps);
    }
    appendContent(part, numStr, title, content);
}

// specifically for laptopmag.com
function buildSectionLTM(originalContent, title, part, numStr) {
    var ps = $(originalContent).nextUntil('h3', 'p');
    var content = getContentFromPs(ps);
    appendContent(part, numStr, title, content);
}

// specifically for notebookcheck.com
function buildSectionNBC(originalContent, title, part, numStr) {
    //<h2>Case</h2></div> <div> <div></div> <div class="csc-textpic-text"><p
    var ps = $(originalContent).parent().next().find('div.csc-textpic-text');
    var content = getContentFromPs(ps);

    //<h2>Connectivity</h2></div></div> <div> <div class="csc-textpic-text">
    if (content == '') {
        ps = $(originalContent).parent().parent().next().find('div.csc-textpic-text');
        content = getContentFromPs(ps);
    }

    //<h3>Speakers</h3></div> <div class="csc-textpic-text">
    if (content == '') {
        ps = $(originalContent).parent().next('div.csc-textpic-text');
        content = getContentFromPs(ps);
    }

    //<h2>Display</h2></div></div> <div><div></div></div> <div><div class="csc-textpic-text">
    if (content == '') {
        ps = $(originalContent).parent().parent().next().next().find('div.csc-textpic-text');
        content = getContentFromPs(ps);
    }

    //<div class="csc-textpic-text"><h3>Keyboard</h3><p
    if (content == '') {
        ps = $(originalContent).nextUntil('h2, h3', 'p');
        content = getContentFromPs(ps);
    }

    //<h3>Power Consumption</h3></div><p
    if (content == '') {
        ps = $(originalContent).parent().nextUntil('h2, h3', 'p');
        content = getContentFromPs(ps);
    }

    appendContent(part, numStr, title, content);
}

// parse review articles from notebookreview.com
function getArticleFromNBR(url, number) {
    var numStr = number.toString();

    var query = phpUrl + 'fetch&url=' + url;
    $.get(query, function (resultPage) {
        var doc = $.parseHTML(resultPage.toString());

        var title = $(doc).filter('title').html();
        $('#link-' + numStr).append('<a href="' + url + '" target = "_blank">' + title + '</a>');

        // var rating = $(doc).find('li.ratingsTotal li.ratingValue').html();
        var rating = $(doc).find('meta[itemprop="ratingValue"]').prop('originalContent');
        var bestRating = $(doc).find('meta[itemprop="bestRating"]').prop('originalContent');

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

        var summary = $(doc).find('div.pf-originalContent p').first();
        $('#summary-' + numStr).append(summary);

        var parts = $(doc).find('strong,h1,h2');
        parts.each(function (index, part) {
            var title = $(part).html();
            if (title === 'Build and Design') {
                alert(title);
                alert(part);
                buildSectionNBR(part, title, '#design', numStr);

            } else if (title === 'Ports and Features') {
                buildSectionNBR(part, title, '#ports', numStr);

            } else if (title === 'Screen and Speakers') {
                buildSectionNBR(part, title, '#screen_speakers', numStr);

            } else if (title === 'Keyboard and Touchpad') {
                buildSectionNBR(part, title, '#keyboard_touchpad', numStr);

            } else if (title === 'Performance'
                || title === 'Benchmarks') {
                buildSectionNBR(part, title, '#performance', numStr);

            } else if (title === 'Heat and Noise') {
                buildSectionNBR(part, title, '#emission', numStr);

            } else if (title === 'Battery Life') {
                buildSectionNBR(part, title, '#longevity', numStr);

            } else if (title === 'Conclusion') {
                buildSectionNBR(part, title, '#conclusion', numStr);
            }
        });

        // remove all spinners
        $('td[id$="-' + numStr + '"] .spinner').remove();
    });
}

// parse review articles from laptopmag.com
function getArticleFromLTM(url, number) {
    var numStr = number.toString();

    var query = phpUrl + 'fetch&url=' + url;
    $.get(query, function (resultPage) {
        var doc = $.parseHTML(resultPage.toString());

        var title = $(doc).filter('title').html();
        $('#link-' + numStr).append('<a href="' + url + '" target = "_blank">' + title + '</a>');

        var rating = $(doc).find('meta[itemprop="ratingValue"]').prop('originalContent');
        var bestRating = $(doc).find('meta[itemprop="bestRating"]').prop('originalContent');
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

        var summarySection = $(doc).find('section.otm-originalContent')[0];
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

// parse review articles from notebookcheck.com
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