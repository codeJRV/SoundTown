function searchByKeyword() {
  var results = YouTube.Search.list('id,snippet', {q: 'dogs', maxResults: 1});
  for(var i in results.items) {
    var item = results.items[i];
    Logger.log('[%s] Title: %s', item.id.videoId, item.snippet.title);
	return item.id.videoId
  }
}

function go() {
    document.getElementById('youtuber').src = searchByKeyword('Aafreen');
}