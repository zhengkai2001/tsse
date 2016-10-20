// This js enable user to search on three different sites,
// and present search results onto forums_search.html

// var phpUrl = 'http://localhost/tsse/utils.php?';
var phpUrl = 'https://tsse.herokuapp.com/utils.php?';

var rowNumber = 12;
var columnNumber = 3;

var resultTable = $('#table-result-step2');
for (var i = 1; i <= rowNumber; i++) {
    var trId = 'tr-result-step2-' + i.toString();
    resultTable.append('<tr id="' + trId + '"></tr>');
    for (var j = 1; j <= columnNumber; j++) {
        var tr = $('#' + trId);
        var tdId = 'td-result-step2-' + i.toString() + '-' + j.toString();
        tr.append('<td class="col-md-4" id="' + tdId + '"></td>');
    }
}

$(document).on('click', '#next-step1', function () {
    var business = $('#checkbox-business').prop('checked');
    var gaming = $('#checkbox-gaming').prop('checked');
    var computing = $('#checkbox-computing').prop('checked');
    var design = $('#checkbox-design').prop('checked');
    var lightweight = $('#checkbox-lightweight').prop('checked');

    var keywords = 'i7 6700HQ';
    $('#h2-step2').text('Search Results for "' + keywords + '"');

    // forum 1: notebookreview
    var query1 = phpUrl + 'search&forum=nbr&keywords==' + keywords;
    $.get(query1, function (resultPage) {
        var doc = $.parseHTML(resultPage.toString());

        var resultTitleHtml = $(doc).find('h1.searchResultsTitle').html();
        var indexOfFor = resultTitleHtml.indexOf('for');
        var resultTitle = resultTitleHtml.substr(0, indexOfFor) + 'from NotebookReview';
        $('#h3-forum1-step2').text(resultTitle);

        var results = $(doc).find('div.contentListItem');
        results.each(function (index, result) {
            var i = (index + 1).toString();

            var tdId = 'td-result-step2-' + i + '-1';
            var td = $('#' + tdId);

            // "Interested" checkbox
            td.append('<div class="form-group"><input type="checkbox" id="checkbox-step2-' + i + '-1" /><div class="btn-group"><label for="checkbox-step2-' + i + '-1" class="btn btn-info"><span class="glyphicon glyphicon-ok"></span><span> </span></label><label for="checkbox-step2-' + i + '-1" class="btn btn-default active">Interested</label></div></div>');

            var imageUrl = $(result).find('img').prop('src');
            td.append('<img src="' + imageUrl + '">');

            var title = $(result).find('h4.title');
            var a = $(title).find('a')[0];
            td.append('<p><a href="' + a + '">' + title.text() + '</a></p>');

            var summary = $(result).find('p.summary');
            td.append(summary);
        });
    });

    // forum 2: laptopmag
    var query2 = phpUrl + 'search&forum=ltm&keywords==' + keywords;
    $.get(query2, function (resultPage) {
        var doc = $.parseHTML(resultPage.toString());
        // alert(resultPage.toString());

        // var resultTitle = $(doc).find('h1.sectionHeader span').toString();
        // alert(resultTitle);

        var results = $(doc).find('div');
        results.each(function (index, result) {
            var i = (index + 1).toString();
            //alert($(result).html());

            var tdId = 'td-result-step2-' + i + '-2';
            var td = $('#' + tdId);

            // "Interested" checkbox
            td.append('<div class="form-group"><input type="checkbox" id="checkbox-step2-' + i + '-2" /><div class="btn-group"><label for="checkbox-step2-' + i + '-2" class="btn btn-info"><span class="glyphicon glyphicon-ok"></span><span> </span></label><label for="checkbox-step2-' + i + '-2" class="btn btn-default active">Interested</label></div></div>');

            // var imageUrl = $(result).find('img').prop('src');
            // alert(imageUrl);
            // td.append('<img src="' + imageUrl + '">');

            //var title = $(result).find('a.gs-title')[0];
            //td.append('<p><a href="' + a + '">' + title.text() + '</a></p>');

            td.append($(result).html());
        });
    });


    $('#search-carousel').carousel(1);
});

