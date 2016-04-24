var request = require('request');
var cheerio = require('cheerio');
var marked = require('marked');
var fs = require('fs');

marked.escape = function(html, encode)
{
    return html;
}

function getContinuations(set, author)
{
    // Recursively search through comments, looking for plausible continuations
    for(var key in set)
    {
        var c = set[key].data;

        if(c.author === author && c.body_html.length > 1000)
        {
            var html = '\n\n\n------\n\n\n' + c.body;

            if(c.replies.data)
                html += getContinuations(c.replies.data.children, author);

            return html;
        }
    }

    return '';
}

function getPostMarkdown(json)
{
    var post = json[0].data.children[0].data;
    var author = post.author;
    var md = post.selftext + getContinuations(json[1].data.children, author);

    return md.replace(/&amp;/g, '&');
}

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

    return tokens.slice(4, tokens.length - 1).join('_');
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

    request({ uri: params.chap.src + '.json' }, function(parmas, callback, uri_cache) { return function(error, response, body)
    {
        if(response.statusCode === 503)
        {
            console.log('[\033[91mRetrying\033[0m] ' + params.chap.id);
            uri_cache.get(params, callback);
            return;
        }

        console.log('[\033[93mFetched\033[0m] ' + params.chap.id);
        uri_cache.cache.push(params.chap.id);

        var md = getPostMarkdown(JSON.parse(body));
        var html = marked(md);

        params.chap.dom = cheerio.load(html, { decodeEntities: true });
        
        fs.writeFileSync(__dirname + '/../cache/' + params.chap.id, params.chap.dom.html(), encoding = 'utf-8');
        
        if(false)
        {
            fs.writeFileSync(__dirname + '/../cache/' + params.chap.id + '.marked', html, encoding = 'utf-8');
            fs.writeFileSync(__dirname + '/../cache/' + params.chap.id + '.md', md, encoding = 'utf-8');
        }
        
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
