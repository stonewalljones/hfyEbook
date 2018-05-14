const cheerio = require('cheerio');

function filterText($, e)
{
    if(e.type === 'tag')
    {
        const c = $(e).contents();
        
        for(let i = 0; i < c.length; i++)
            filterText($, c[i]);
    }
    else if(e.type === 'text')
    {
        // This is less odd than it looks: The second space
        // is some weird unicode character. Here, we're replacing
        // the byte sequence 0x20c2 -> 0x20.
        e.data = e.data.replace(/  /g, ' ');
    }
}

function apply(params, next)
{
    const $ = params.chap.dom;
    const cont = $($('.entry-content')[0].children);
    
    $._root.children = [];
    $.root().append(cont);
    
    $('a').remove();
    $('ul').remove();
    $('div').remove();
    $('form').remove();
    $('label').remove();
    $('address').remove();
    $('img').remove();
    
    $('p').each(function(i, e)
    {
        const el = $(e);
        const t = el.text();
        
        if(t.replace(/&nbsp;/g, '').trim() === '')
        {
            el.remove();
            return;
        }
        
        if(t === '■')
        {
            el.replaceWith('<hr/>');
            return;
        }
        
        delete e.attribs['ltr'];
        delete e.attribs['style'];
    
        const c = el.children();
        
        if(c.length < 1)
            return;
        
        let lc = c[c.length - 1];
        
        if(lc.type === 'tag' && lc.name === 'br')
            $(lc).remove();
    });
    
    $('i').each(function(i, e)
    {
        e.name = 'em';
    });

    $('b').each(function(i, e)
    {
        e.name = 'strong';
    });

    $('em').each(function(i, e)
    {
        const c = $(e).children();
        
        if(c.length < 1)
            return;
            
        let lc = c[c.length - 1];
        
        if(lc.type === 'tag' && lc.name === 'br')
            $(lc).remove();
    });
    
    const c = $.root().children();
    
    for(let i = 0; i < c.length; i++)
        filterText($, c[i]);
    
    next();
}

module.exports =
{
    apply: apply
};
