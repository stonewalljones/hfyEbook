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
    return s.substr(0, r.length) === r;
}

// The Reddit JSON API seems to have a general bug in its handling of entity
// encoding in 'code' and 'pre' tags, e.g. monospaced blocks.
function fixMonoEntities($)
{
    const pt = /&amp;(.*;)/g;
    const replaceAmps = function(i, e)
    {
        const cont = $(e).contents();

        for(let i = 0; i < cont.length; i++)
        {
            const c = cont[i];

            if(c.type === 'text')
            {
	            while(pt.exec(c.data))
	                c.data = c.data.replace(pt, '&$1');
            }
        }
    };
    
    $('pre > code').each(replaceAmps);
    $('code > pre').each(replaceAmps);
}

function apply(params, next)
{
    const $ = params.chap.dom;

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

    // Remove all classes and ids
    $('*').each(function(i, e)
    {
        if(e.attribs)
        {
            delete e.attribs['class'];
            delete e.attribs['id'];
        }
    });

    fixMonoEntities($);
    next();
}

module.exports =
{
    apply: apply
};
