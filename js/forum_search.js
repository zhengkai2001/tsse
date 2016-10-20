// This js enable user to search on one site (notebookreview.com),
// and present search results onto forum-search.html.

//var phpUrl = 'http://localhost/tsse/utils.php?';
var phpUrl = 'https://tsse.herokuapp.com/utils.php?';

function searchFromNBR(keywords) {
    // forum: notebookreview
    var query = phpUrl + 'search&forum=nbr&keywords=' + keywords;
    $.get(query, function (resultPage) {
        var doc = $.parseHTML(resultPage.toString());

        // var resultTitleHtml = $(doc).find('h1.searchResultsTitle').text();
        // var indexOfFor = resultTitleHtml.indexOf('for');
        // var message = resultTitleHtml.substr(0, indexOfFor) + 'from NotebookReview';
        // $('#message-result').text(message);

        var hasData = false;

        var results = $(doc).find('div.contentListItem');
        results.each(function (index, result) {
            var iStr = (index + 1).toString();

            var trId = 'tr-' + iStr;
            var tdInterestId = 'td-interested-' + iStr;
            var tdContentId = 'td-content-' + iStr;

            var table = $('#table-result');
            table.append('<tr id="' + trId + '"></tr>');
            var tr = $('#' + trId);

            tr.append('<td id="' + tdInterestId + '" class="col-md-2"></td>');
            tr.append('<td id="' + tdContentId + '" class="col-md-10"></td>');
            var tdInterested = $('#' + tdInterestId);
            var tdContent = $('#' + tdContentId);

            // "Interested" checkbox
            tdInterested.append('<div class="form-group"><input type="checkbox" id="checkbox-' + iStr + '"/><div class="btn-group"><label for="checkbox-' + iStr + '" class="btn btn-info"><span class="glyphicon glyphicon-ok"></span><span> </span></label><label for="checkbox-' + iStr + '" class="btn btn-default active">Interested</label></div> </div>');

            var imageUrl = $(result).find('img').prop('src');
            tdContent.append('<img src="' + imageUrl + '">');

            var title = $(result).find('h4.title');
            var a = $(title).find('a')[0];
            tdContent.append('<p><a href="' + a + '">' + title.text() + '</a></p>');

            var summary = $(result).find('p.summary');
            tdContent.append(summary);

            hasData = true;
        });

        if (hasData) {
            $('.no-data').hide();
        } else {
            $('.no-data').show();
        }
    });

    $('#search-carousel').carousel(1);
}

function customSearch() {
    var keywords = customInput.val();
    searchFromNBR(keywords);
}

var customInput = $('#custom-input');
customInput.bind('enterKey', function (e) {
    customSearch();
    event.preventDefault();
});
customInput.keyup(function (e) {
    if (e.keyCode == 13) {
        $(this).trigger('enterKey');
    }
});

$(document).on('click', '#custom-search', function (event) {
    customSearch();
    event.preventDefault();
});

$(document).on('click', '.feature', function () {
    var keywords = $(this).text().trim();
    searchFromNBR(keywords);
});

$(document).on('click', '#next-result', function (event) {
    var selectedCheckboxIds = [];
    $('[type=checkbox]').each(function () {
        var id = $(this).prop('id').toString().substring(9);
        if ($(this).prop('checked')) {
            selectedCheckboxIds.push(id);
        }
    });

    $.each(selectedCheckboxIds, function (index, id) {
        var tdContent = $('#td-content-' + id);
        var href = tdContent.find('p a').prop('href');
        getArticleFromNBR(href, index + 1);
    });

    $('#search-carousel').carousel(2);
    event.preventDefault();
});
