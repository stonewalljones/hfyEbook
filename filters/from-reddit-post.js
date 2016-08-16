var request = require('request');
var cheerio = require('cheerio');
var marked = require('marked');
var child_process = require('child_process');
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

function uriToId(uri)
{
    var tokens = uri.split('/');

    return decodeURI(tokens.slice(4, tokens.length - 1).join('_'));
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

    request({ uri: params.chap.src + '.json' }, function(params, callback, uri_cache) { return function(error, response, body)
    {
        if(!response || response.statusCode === 503)
        {
            console.log('[\033[91mRetrying\033[0m] ' + params.chap.id);
            get(params, callback);
            return;
        }

        console.log('[\033[93mFetched\033[0m] ' + params.chap.id);
        params.uri_cache.cache.push(params.chap.id);

        var md = getPostMarkdown(JSON.parse(body));
        var html = marked(md);

        // Handle non-standard Reddit superscript markdown.
        html = html.replace(/\^\^([^ ]+)/g, '<sup>$1</sup>');
        
        params.chap.dom = cheerio.load(html, params.cheerio_flags);
        
        fs.writeFileSync(__dirname + '/../cache/' + params.chap.id, params.chap.dom.html(), encoding = 'utf-8');
        
        if(false)
        {
            fs.writeFileSync(__dirname + '/../cache/' + params.chap.id + '.marked', html, encoding = 'utf-8');
            fs.writeFileSync(__dirname + '/../cache/' + params.chap.id + '.md', md, encoding = 'utf-8');
        }
        
        child_process.execSync("sleep 1");
        callback();
    }}(params, callback, this));
};

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
