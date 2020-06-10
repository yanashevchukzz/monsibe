/* 21 enero 2016  */

var gs_config = {
  net : {
    domain : 'http://buscador.sanborns.com.mx',
    url : "/search?btnG=Google+Search&access=p",
    proxy_css : 'claroshop_mobile',
    proxy_css_mobile : 'claroshop_mobile',
    site : 'claroshop',
    client : 'claroshop',
    suggestions : "/suggest?max=10&access=p&format=rich&callback=?",

  },
  // page selectors
  slctrs : {
    form : '#h_finder',
    input : '#q',
    btnSrch : '.bt__search',
    frame : '.wrapper',
    idframe  : 'GSAFrame',
    c_s : '.contSearch',
    c_f: '.conent__filtro'
  },
  html : {

  },
  extra : {
    debug : false,
    external_rsrc : "",
    jQ : window.$,
  },
};