const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

function uriToId(uri)
{
    const tokens = uri.split('/');

    return 'HFYA_' + decodeURI(tokens.slice(tokens.length-2, tokens.length).join('_'));
};

function get(params, callback)
{
    if(params.uri_cache.cache.indexOf(params.chap.id) > -1)
    {
        console.log('[\033[92mCached\033[0m] ' + params.chap.id);
        params.chap.dom = cheerio.load(fs.readFileSync(__dirname + '/../cache/' + params.chap.id, encoding = 'utf-8'), params.cheerio_flags);
        callback();
        return;
    }

    request({ uri: params.chap.src}, function(parmas, callback, uri_cache) { return function(error, response, body)
    {
        if(!response || response.statusCode === 503)
        {
            console.log('[\033[91mRetrying\033[0m] ' + params.chap.id);
            get(params, callback);
            return;
        }
        // hfy-archive has been moved and redirects the links with the following construct:
        // requests does not follow these automatically
        let regex = /link rel="canonical" href="([^"]+)[^>]+/;
        let match = regex.exec(body);
        if(match !== null){
        if (match[1] !== undefined) {
          // We need a new request to fetch the real page
          let host = response.req.res.request.uri.host;
          request.get({
            url: "http://" + host + match[1],
          }, function(error, response, body) {
            if(error){console.log(error)}
            handleResponse(params, body, callback);
          });
        } }
        else {
          // The webpage doesn't contain a redirect
          // Possibly this should be an error, I don't know if the archive
          // does still host other stories or is being phased out.
          handleResponse(params, body, callback);
        }
    }}(params, callback, this));
};

function handleResponse(params, body, callback){
  // Abstracted handling of webpage
  console.log('[\033[93mFetched\033[0m] ' + params.chap.id);
  params.uri_cache.cache.push(params.chap.id);

  const $ = cheerio.load(body, params.cheerio_flags);
  console.log("Lengte van geladen ding:");
  console.log($.html().length);

  let   content = $('article').contents();

  $.root().children().remove();
  $.root().append(content);
  $($.root().contents()[0]).remove(); // Remove doctype tag

  content = $.root().contents();

  for(let i = 0; i < content.length; i++)
  {
    const e = content[i];

    if(e.type === 'text' && e.data === '\n\n')
      e.data = '\n';
  }

  params.chap.dom = $;
  console.log("Lengte van schrijfding:");
  console.log($.html().length);

  fs.writeFileSync(__dirname + '/../cache/' + params.chap.id, params.chap.dom.xml(), encoding = 'utf-8');

  callback();
}

function apply(params, next)
{
    params.chap.id = uriToId(params.chap.src);

    get(params, function()
    {
        next();
    });
}

module.exports =
{
    apply: apply
};
