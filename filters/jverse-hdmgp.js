function apply(params, next)
{
    const chap = params.chap;
    const $ = chap.dom;
	const rem = [];
	
    if(chap.title.substr(chap.title.length - 2, 2) === ' 7')
    {
        const ps = $('p');

        rem.push($(ps[0]));
        rem.push($(ps[1]));
    }

    rem.push($('#-'));
    rem.push($('#continued-in-part-2-http-redd-it-2ydy99-'));

    // Remove next / prev chapter link paragraphs and author post-ambles.
    // Also gets rid of inexplicable empty paragraphs.
    $('p').each(function(i, e)
    {
        const el = $(e);

        if(el.find('a').length || el.contents().length < 1)
			rem.push(el);
    });

    // Remove 'All chapter' references
    $('p span').each(function(i, e)
    {
        const el = $(e);

        if(el.text() === 'All chapters')
        	rem.push(el.parent());
    });

    $('h2').each(function(i, e)
    {
        e.name = 'p';
        delete e.attribs['id'];
    });

    const pa = $('hr').last().nextAll();
    const html = $.html(pa);
    
    if(html.length < 500)
    {
    	for(let i = 0; i < pa.length; i++)
    		rem.push($(pa[i]));
    }
    
    params.purge(rem);
    next();
}

module.exports =
{
    apply: apply
};
