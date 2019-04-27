
"use strict";

var accessToken = null;
var $visualizers = $('.visualizer>div');
var $progressBar = $('.progress-bar');
var $progressBarRunner = $progressBar.find('.runner');
var songLength = 219; //in seconds
var percentage = 0
var $time = $('.time');
var $player = $('.player');
var state = "paused"


function error(msg) {
    info(msg);
}

function info(msg) {
    $("#info").text(msg);
}

function authorizeUser() {
    console.log("In authorizeUser");
    var scopes = 'user-top-read user-read-recently-played user-read-currently-playing user-read-playback-state user-modify-playback-state';
    var url = 'https://accounts.spotify.com/authorize?client_id=' + SPOTIFY_CLIENT_ID +
        '&response_type=token' +
        '&show_dialog=false' +
        '&scope=' + encodeURIComponent(scopes) +
        '&redirect_uri=' + encodeURIComponent(SPOTIFY_REDIRECT_URI);
    document.location = url;
    console.log("authorizeUser completed successfully");
}

function parseArgs() {
    var hash = location.hash.replace(/#/g, '');
    var all = hash.split('&');
    var args = {};
    _.each(all, function(keyvalue) {
        var kv = keyvalue.split('=');
        var key = kv[0];
        var val = kv[1];
        args[key] = val;
    });
    return args;
}

function callSpotify(type, url, json, callback) {
    var payload = {
        type: type,
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        success: function(r) {
            callback(true, r);
        },
        error: function(r) {
            // 2XX status codes are good, but some have no
            // response data which triggers the error handler
            // convert it to goodness.
            if (r.status >= 200 && r.status < 300) {
                callback(true, r);
            } else {
                callback(false, r);
            }
        }
    };

    if (json != null) {
        payload.data = JSON.stringify(json);
        payload.dataType = 'json';
    }

    $.ajax(url, payload);
}

function fetchNowPlaying(callback) {
    var url = 'https://api.spotify.com/v1/me/player/currently-playing';
    callSpotify("GET", url, null, callback);
}

function fetchPlayHistory(callback) {
    var url = 'https://api.spotify.com/v1/me/player/recently-played?limit=50'
    var items = [];
    function fetcher(url) {
        callSpotify("GET", url, null, function(status, data) {
            if (status) {
                _.each(data.items, function(item) {
                    items.push(item);
                });
                if (data.next) {
                    fetcher(data.next);
                } else {
                    callback(status, items);
                }
            } else {
                callback(false, items);
            }
        });
    }

    fetcher(url);
}

function playNext(callback) {
    var url = 'https://api.spotify.com/v1/me/player/next';
    callSpotify("Post", url, null, callback);
}

function playTrack(uri, callback) {
    console.log("track clicked");
    $player.toggleClass('paused').toggleClass('playing');
    var url = 'https://api.spotify.com/v1/me/player/play';
    callSpotify("PUT", url, {uris:[uri]}, callback);
}

function seek(position_ms) {
    var url = 'https://api.spotify.com/v1/me/player/seek?position_ms=' + position_ms;
    callSpotify("PUT", url, null, function(status, data) { });
}

function pause() {
    $player.toggleClass('paused').toggleClass('playing');
    var url = 'https://api.spotify.com/v1/me/player/pause';
    callSpotify("PUT", url, null, function(status, data) { refreshNowPlaying(); });

}

function play() {
    $player.toggleClass('paused').toggleClass('playing');
    var url = 'https://api.spotify.com/v1/me/player/play';
    callSpotify("PUT", url, null, function(status, data) { refreshNowPlaying(); });
    

}

function playArtist(uri, callback) {
    $player.toggleClass('paused').toggleClass('playing');
    var url = 'https://api.spotify.com/v1/me/player/play';
    callSpotify("PUT", url, {context_uri:uri}, callback);
}

function isLocalHost() {
    return window.location.host.indexOf('localhost') >= 0;
}

function go() {
    $('.err-txt').text("");
    authorizeUser();
}

function refreshNowPlaying() {
    fetchNowPlaying(function(status, data) {
        var time_delta = now() - (data.timestamp + data.progress_ms);
        if (data.item.album.images.length > 0) {
            $("#now-playing-cover-art").attr('src', data.item.album.images[0].url);
            document.getElementById('album-cover').src=data.item.album.images[0].url;
            
        }
        var progress = Math.round(data.progress_ms / 1000);
        var sprogress = fmtTime(progress);
        var remains = Math.round(data.item.duration_ms / 1000) - progress;
        var sremains = fmtTime(remains);

        var ctx = data.context ? data.context.type + " context" : "";
        var uri = data.context ? data.context.uri :  " ";

        $("#now-playing-song-name").text(data.item.name);
        document.getElementById("SongTitle").innerHTML = data.item.name;

        $("#now-playing-artist-name").text(data.item.artists[0].name);
        document.getElementById("SongArtist").innerHTML = data.item.artists[0].name;

        $("#now-playing-progress").text(sprogress);
        $("#now-playing-remains").text(sremains);
        $("#now-playing-context").text( ctx);
        $("#now-playing-context").attr("href", uri);
        $("#now-playing-playing").text( data.is_playing ? "playing" : "paused");

        if (data.context) {
            $(".next").show();
        } else {
            $(".next").hide();
        }
        if (data.is_playing) {
            $(".play").hide();
            $(".pause").show();
        } else {
            $(".play").show();
            $(".pause").hide();
        }
    });
}

function autoRefreshNowPlaying() {
    refreshNowPlaying();
    setTimeout(autoRefreshNowPlaying, 1000);
}

function now() {
    var d = new Date();
    return d.getTime()
}

function fmtTime(time) {
    var mins = Math.floor(time / 60);
    time -= mins * 60;
    var timeString = pad(mins) + ":" + pad(Math.floor(time));
    return timeString;
}

function pad(num) {
    return ("00" + num).substr(-2,2);
}

function refreshDevices() {
    var url = 'https://api.spotify.com/v1/me/player/devices';
    callSpotify("GET", url, null, function(status, data) {
        var tbl = $("#devices");
        tbl.empty();
        _.each(data.devices, function(device) {
            var tr = $("<tr>");
            tr.append($("<td>").text(device.name));
            tr.append($("<td>").text(device.type));
            tr.append($("<td>").text(device.is_active));
            tr.append($("<td>").text(device.is_restricted));
            tr.append($("<td>").text(device.volume_percent));
            tbl.append(tr);
        });
    });
}

function getTrackAnchor(track) {

    var a = $("<a>").text(track.name);
    a.on("click", function() {
        console.log("in get track anchor");
        playTrack(track.uri, function(data) {
            refreshNowPlaying();
        });
    });
    return a;
}

function getArtistAnchor(name, uri) {
    var a = $("<a>").text(name);
    a.on("click", function() {
        playArtist(uri, function(data) {
            refreshNowPlaying();
        });
    });
    return a;
}

function refreshPlayHistory() {

    fetchPlayHistory(function(status, items) {
        var tbl = $("#history");
        _.each(items, function(item, i) {
            var track = item.track;
            var tr = $("<tr>");
            var ctx_uri = "";
            if (item.context) {
                ctx_uri = $("<a>").text(item.context.type).attr("href", item.context.uri);
            }

            tr.append($("<td>").text(i + 1));
            tr.append($("<td>").append(getTrackAnchor(track)));
            tr.append($("<td>").append(getArtistAnchor(track.artists[0].name, track.artists[0].uri)));
            tr.append($("<td>").text(fmtTime(track.duration_ms / 1000.)));
            tr.append($("<td>").append(ctx_uri));
            tr.append($("<td>").text(new Date(Date.parse(item.played_at)).toLocaleString()));
            //tr.append($("<td>").text(item.played_at));
            tbl.append(tr);
        });
    });
}


function fetchTopItems(type, time, callback) {
    var url = 'https://api.spotify.com/v1/me/top/' + type + "?limit=50&time_range=" + time;
    callSpotify("GET", url, null, callback);
}

function refreshTopArtists(time, tbl) {
    fetchTopItems("artists", time, function(status, data) {
        tbl.empty();
        _.each(data.items, function(item, i) {
            var track = item.track;
            var tr = $("<tr>");
            tr.append($("<td>").text(i + 1));
            tr.append($("<td>").append(getArtistAnchor(item.name, item.uri)));
            tr.append($("<td>").text(item.popularity));
            tbl.append(tr);
        });
    });
}

function refreshTopTracks(time, tbl) {
    fetchTopItems("tracks", time, function(status, data) {
        _.each(data.items, function(item, i) {
            var track = item;
            var tr = $("<tr>");
            tr.append($("<td>").text(i + 1));
            tr.append($("<td>").append(getTrackAnchor(track)));
            tr.append($("<td>").append(getArtistAnchor(item.artists[0].name, item.artists[0].uri)));
            tr.append($("<td>").text(item.popularity));
            tbl.append(tr);
        });
    });
}


$(document).ready(
    function() {
        if (isLocalHost()) {
            SPOTIFY_REDIRECT_URI = LOCAL_SPOTIFY_REDIRECT_URI;
        }
        var args = parseArgs();
        window.location.hash = "";
        console.log("I am here in ready");
        $(".work").hide();
        if ('error' in args) {
            error("Sorry, I can't read your play history Spotify without authorization");
            $("#go").show();
            $("#go").on('click', function() {
                go();
            });
        } else if ('access_token' in args) {
            $("#refresh-now-playing").on("click", function() {
                refreshNowPlaying();
            });

            $("#next").on("click", function() {
                playNext( function() {
                });
            });

            $("#pause").on("click", function() {
                pause();
            });

            $("#play").on("click", function() {      
                play();
            });

            

            $(".work").show();
            $(".intro").hide();
            accessToken = args['access_token'];
            refreshDevices();
            refreshPlayHistory();
            refreshTopArtists('short_term', $("#short-term-top-artists"));
            refreshTopArtists('medium_term', $("#medium-term-top-artists"));
            refreshTopArtists('long_term', $("#long-term-top-artists"));

            refreshTopTracks('short_term', $("#short-term-top-tracks"));
            refreshTopTracks('medium_term', $("#medium-term-top-tracks"));
            refreshTopTracks('long_term', $("#long-term-top-tracks"));
            autoRefreshNowPlaying();
        } else {
            $("#go").show();
            $("#go").on('click', function() {
                go();
            });
        }
    }
);

$('.play-button').on('click', function() {
            //   $player.toggleClass('paused').toggleClass('playing');
              if(state == "playing"){
                  pause();
                  state = "paused";
                }
              else{
                  play();
                  state = "playing";
              }

            });

// var playRunner = null;

// function go() {
//   playRunner = setInterval(function() {
//     //visualizers
//     $visualizers.each(function() {
//       $(this).css('height', Math.random() * 90 + 10 + '%');
//     });
//     //progress bar
//     percentage += 0.15;
//     if (percentage > 100) percentage = 0;
//     $progressBarRunner.css('width', percentage + '%');

//     $time.text(calculateTime(songLength, percentage));
//   }, 250);
// };




// $('.progress-bar').on('click', function(e) {
//   var posY = $(this).offset().left;
//   var clickY = e.pageX - posY;
//   var width = $(this).width();

//   percentage = clickY / width * 100;
// });

// function calculateTime(songLength, percentage) {
//   //time
//   var currentLength = songLength / 100 * percentage;
//   var minutes = Math.floor(currentLength / 60);
//   var seconds = Math.floor(currentLength - (minutes * 60));
//   if (seconds <= 9) {
//     return (minutes + ':0' + seconds);
//   } else {
//     return (minutes + ':' + seconds);
//   }
// }

// clearInterval(playRunner);

