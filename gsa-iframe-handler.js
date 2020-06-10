/* 23 de enero 2016 */
var getURLSearch = function(config, query, mobile) {
  var url = "";
  url += config.domain + config.url;
  url += "&client=" + config.client;
  url += "&output=xml_no_dtd&proxystylesheet=" + ((mobile) ? config.proxy_css_mobile : config.proxy_css);
  url += "&sort=date%3AD%3AL%3Ad1&wc=200&wc_mc=1&oe=UTF-8";
  url += "&site=" + config.site;
  url += "&ie=UTF-8&ud=1&exclude_apps=1&filter=0&getfields=*";
  url += "&q=" + query;
  if (config.results)
    url += "&num=" + config.results
  return url;
};

var getURLSuggestions = function(config) {
  var url = "";
  url += config.domain + config.suggestions;
  url += "&client=" + config.client;
  return url;
};

var getFrame =  function(id,w, h, src) {
  return '<iframe id="' + id+ '" src="' + src +'" style="margin-top:50px;width:1px; min-width:100%' +
            '"></iframe>'
}

var getParameterByName =  function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

var GSA = GSA || ({

  init : function (config) {
    if (typeof config === 'undefined') {
      throw new Error("Falta archivo de configuracion");
    }


    var _suggestions_url = getURLSuggestions(config.net);
    var $ = config.extra.jQ;
    var _s = config.slctrs;
    var _isSearch = getParameterByName('q');

    var _form = $(_s.form);
    var _input = $(_s.input);
    var _prods = $(_s.frame);

    _input.off();
    _form.off();
    
    _form.removeAttr('action','');

    _form.on('submit', function (e) {
      e.preventDefault();
      location.href = "/s/?q=" + _input.val();
    });

    _form.submit(function (e) {
      e.preventDefault();
      location.href = "/s/?q=" + _input.val();
      return false;
    });



    if (_isSearch != '') {
      //insert frame here
      var _w = document.body.offsetWidth;
      var _srch_uri = getURLSearch(config.net, _isSearch,(_w <= 768));
      _input.val(_isSearch);
      _prods.addClass('container');
      _prods.html(getFrame(_s.idframe,0,0,_srch_uri));
      _prods.removeClass('wrapper');
      $(".viewSearch").first().css('z-index','115');
    }

    var html = config.html;
    var container = $(_s.c_s);
    container.append('<div id="suggestions"></div>');
    var suggestions = $("#suggestions");

    suggestions.on('click', '.gsa_suggestion', function(e){
      location.href = '/s/?q=' + $(this).text(); 
    });

    var pageSearh = $(_s.input);

    pageSearh.on('keydown', function(e) {
       var query  = $(this).val();
       if (e.keyCode == 13) {
        location.href = '/s/' +  '?q=' + query; 
      }
    });

    if(parent.postMessage != undefined) {
      var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
      var eventer = window[eventMethod];
      var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

      eventer(messageEvent, function(e) {
        try {
           var json = JSON.parse(e.data);
        } catch(e) {
           return;
        }
        if(json.url) {
          location.href = json.url;
        } else if (json.resize) {
          GSA.talkChild();
        }

        var datos = JSON.parse(e.data);
        $("#GSAFrame").animate({height: datos.height}, 300);
        _prods.animate({height: (datos.height + 50)}, 100);
        _prods.css({maxHeight: (datos.height + 50)});
        if( datos.scrollTop ) {
          $("html, body").animate({ scrollTop: 0 }, 100);
        }
      }, false);
    }
  },
  talkChild : function(e) {
    var child = document.getElementById('GSAFrame');
    var frame = $("#GSAFrame");
    if (child.contentWindow) {
      child.contentWindow.postMessage(JSON.stringify({
        resize : true,
        width : frame.parent().width()
      }), '*');

    } 
  }
});

function chechSize(conf) {
  var _w = document.body.offsetWidth;
  var frame = $("#GSAFrame");
  
  if (_w > 768)
    conf.results = 24;
  else
    conf.results = 12;
}

$(function(){
  chechSize(gs_config.net)
  GSA.init(gs_config);
  if (getParameterByName('q') != '') {
    setInterval(function(){
      GSA.talkChild();
    },300);
  }

});