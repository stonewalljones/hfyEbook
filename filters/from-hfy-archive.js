var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

function UriCache()
{
    this.cache = [];

    var files = fs.readdirSync(__dirname + '/../cache');

    for(var i = 0; i < files.length; i++)
        this.cache.push(files[i]);
}

UriCache.prototype.uriToId = function(uri)
{
    var tokens = uri.split('/');

    return 'HFYA_' + tokens.slice(tokens.length-2, tokens.length).join('_');
};

UriCache.prototype.get = function(params, callback)
{
    var id = this.uriToId(params.chap.src);

    params.chap.id = id;

    if(this.cache.indexOf(id) > -1)
    {
        console.log('[\033[92mCached\033[0m] ' + id);
        params.chap.dom = cheerio.load(fs.readFileSync(__dirname + '/../cache/' + id, encoding = 'utf-8'), { decodeEntities: true });
        callback();
        return;
    }

    request({ uri: params.chap.src }, function(parmas, callback, uri_cache) { return function(error, response, body)
    {
        if(response.statusCode === 503)
        {
            console.log('[\033[91mRetrying\033[0m] ' + params.chap.id);
            uri_cache.get(params, callback);
            return;
        }

        console.log('[\033[93mFetched\033[0m] ' + params.chap.id);
        uri_cache.cache.push(params.chap.id);

        var $ = cheerio.load(body, { decodeEntities: true });
        var content = $('div.node-content div[property]').contents();
        
        $.root().children().remove();
        $.root().append(content);
		$($.root().contents()[0]).remove(); // Remove doctype tag
		
        content = $.root().contents();
        
        for(var i = 0; i < content.length; i++)
        {
        	var e = content[i];
        	
        	if(e.type === 'text' && e.data === '\n\n')
        		e.data = '\n';
        }
        
        params.chap.dom = $;
        
        fs.writeFileSync(__dirname + '/../cache/' + params.chap.id, params.chap.dom.xml(), encoding = 'utf-8');
        
        callback();
    }}(params, callback, this));
};

var uri_cache = new UriCache();

function apply(params, next)
{
    uri_cache.get(params, function()
    {
        next();
    });
}

module.exports =
{
    apply: apply
};
