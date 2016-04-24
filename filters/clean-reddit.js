function removeComments($, el)
{
    $(el).contents().each(function(i, e)
    {
        if(e.type === 'comment')
            $(e).remove();
        else
            removeComments($, e);
    });
}

function startsWith(s, r)
{
    return s.substring(0, r.length) === r;
}

function apply(params, next)
{
    var $ = params.chap.dom;

    // Remove all comments
    removeComments($, $.root());

    // Remove all links that are not external
    $('a').each(function(i, e)
    {
        if(e.attribs && e.attribs.href)
        {
            if(startsWith(e.attribs.href, 'http://www.reddit.com') ||
               startsWith(e.attribs.href, 'https://www.reddit.com'))
            {
                e.name = 'span';
                delete e.attribs;
            }
        }
    });

    // Remove all classes
    $('*').each(function(i, e)
    {
        if(e.attribs)
            delete e.attribs['class'];
    });

    next();
}

module.exports =
{
    apply: apply
};
