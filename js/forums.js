// This js parses review articles from 3 different review sites,
// and provides functions for other js files.

function appendContent(id, numStr, title, content) {
    var tdId = id + '-' + numStr;
    var collapseClass = id.substring(1) + '-collapse';

    if (content == '') {
        content = '(not provided)';
    }

    $(tdId).append('<div class="' + collapseClass + ' collapse"><h4>' + title + '</h4>' + content + '</div>');
}

function getContentFromPs(ps) {
    var content = '';
    ps.each(function (index, p) {
        content += $(p).html().trim();
    });
    return content;
}

// specifically for notebookreview.com
function buildSectionNBR(part, title, id, numStr) {
    var ps = $(part).nextUntil('strong, b, p:has(b), h1, h2', 'p');
    var content = getContentFromPs(ps);

    //<h1></h1> <p></p><p></p>
    if (content == '') {
        ps = $(part).parent().nextUntil('strong, b, p:has(b), h1, h2', 'p');
        content = getContentFromPs(ps);
    }
    appendContent(id, numStr, title, content);
}

// specifically for laptopmag.com
function buildSectionLTM(part, title, id, numStr) {
    var ps = $(part).nextUntil('h3', 'p');
    var content = getContentFromPs(ps);
    appendContent(id, numStr, title, content);
}

// specifically for notebookcheck.com
function buildSectionNBC(part, title, id, numStr) {
    //<h2>Case</h2></div> <div> <div></div> <div class="csc-textpic-text"><p
    var ps = $(part).parent().next().find('div.csc-textpic-text');
    var content = getContentFromPs(ps);

    //<h2>Connectivity</h2></div></div> <div> <div class="csc-textpic-text">
    if (content == '') {
        ps = $(part).parent().parent().next().find('div.csc-textpic-text');
        content = getContentFromPs(ps);
    }

    //<h3>Speakers</h3></div> <div class="csc-textpic-text">
    if (content == '') {
        ps = $(part).parent().next('div.csc-textpic-text');
        content = getContentFromPs(ps);
    }

    //<h2>Display</h2></div></div> <div><div></div></div> <div><div class="csc-textpic-text">
    if (content == '') {
        ps = $(part).parent().parent().next().next().find('div.csc-textpic-text');
        content = getContentFromPs(ps);
    }

    //<div class="csc-textpic-text"><h3>Keyboard</h3><p
    if (content == '') {
        ps = $(part).nextUntil('h2, h3', 'p');
        content = getContentFromPs(ps);
    }

    //<h3>Power Consumption</h3></div><p
    if (content == '') {
        ps = $(part).parent().nextUntil('h2, h3', 'p');
        content = getContentFromPs(ps);
    }

    appendContent(id, numStr, title, content);
}

var dictNBR = {
    'Build and Design': '#design',
    'Ports and Features': '#ports',
    'Ports': '#ports',
    'Input and Output Ports': '#ports',
    'Screen and Speakers': '#screen_speakers',
    'Display and Sound': '#screen_speakers',
    'Display and Speakers': '#screen_speakers',
    'Keyboard and Touchpad': '#keyboard_touchpad',
    'Performance': '#performance',
    'Benchmarks': '#performance',
    'Heat and Noise': '#emission',
    'Battery Life': '#longevity',
    'Conclusion': '#conclusion'
};

// parse review articles from notebookreview.com
function getArticleFromNBR(url, number) {
    var numStr = number.toString();

    var query = phpUrl + 'fetch&url=' + url;
    $.get(query, function (resultPage) {
        var doc = $.parseHTML(resultPage.toString());

        var title = $(doc).filter('title').html();
        $('#link-' + numStr).append('<a href="' + url + '" target = "_blank">' + title + '</a>');

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

        var done = {};
        var parts = $(doc).find('strong,b,h1,h2');
        parts.each(function (index, part) {
            var title = $(part).text().trim();

            if (title in dictNBR && !(title in done)) {
                done[title] = true;
                buildSectionNBR(part, title, dictNBR[title], numStr);
            }
        });

        removeAllSpinners(numStr);
    });
}

var dictLTM = {
    'Design': '#design',
    'Ports': '#ports',
    'Display': '#screen_speakers',
    'Audio': '#screen_speakers',
    'Keyboard and Touchpad': '#keyboard_touchpad',
    'Performance': '#performance',
    'Graphics Performance': '#performance',
    'Heat': '#emission',
    'Battery Life': '#longevity',
    'Verdict': '#conclusion'
};

// parse review articles from laptopmag.com
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

        var done = {};
        var parts = $(doc).find('h2, h3');
        parts.each(function (index, part) {
            var title = $(part).text().trim();
            if (title === 'Verdict /') {
                title = 'Verdict';
            }

            if (title in dictLTM && !(title in done)) {
                done[title] = true;
                buildSectionLTM(part, title, dictLTM[title], numStr);
            }
        });

        removeAllSpinners(numStr);
    });
}

var dictNBC = {
    'Case': '#design',
    'Connectivity': '#ports',
    'Display': '#screen_speakers',
    'Speakers': '#screen_speakers',
    'Keyboard': '#keyboard_touchpad',
    'Touchpad': '#keyboard_touchpad',
    'Processor': '#performance',
    'System Performance': '#performance',
    'Graphics Card': '#performance',
    'Gaming Performance': '#performance',
    'Storage Device': '#performance',
    'System Noise': '#emission',
    'Temperature': '#emission',
    'Power Consumption': '#longevity',
    'Verdict': '#conclusion'
};

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

        var proSpans = $(doc).find('span.pro_eintrag');
        var prosStr = '<ul>';
        proSpans.each(function (index, proSpan) {
            prosStr += '<li>' + $(proSpan).text() + '</li>';
        });
        prosStr += '</ul>';
        $('#pros-' + numStr).append(prosStr);

        var conSpans = $(doc).find('span.contra_eintrag');
        var consStr = '<ul>';
        conSpans.each(function (index, conSpan) {
            consStr += '<li>' + $(conSpan).text() + '</li>';
        });
        consStr += '</ul>';
        $('#cons-' + numStr).append(consStr);

        var summarySection = $(doc).find('b')[0];
        var summaryText = $(summarySection).parent().html();
        $('#summary-' + numStr).append(summaryText);

        var done = {};
        var parts = $(doc).find('h2, h3');
        parts.each(function (index, part) {
            var title = $(part).text().trim();

            if (title in dictNBC && !(title in done)) {
                done[title] = true;
                buildSectionNBC(part, title, dictNBC[title], numStr);
            }
        });

        removeAllSpinners(numStr);
    });
}

function removeAllSpinners(numStr) {
    $('td[id$="-' + numStr + '"] .spinner').remove();
}

// when a <td> has content, hide spinner
$('td').bind("DOMSubtreeModified", function () {
    var label = $(this).find('.spinner');
    //alert(label.html())
    label.css("visibility", "hidden");
});
