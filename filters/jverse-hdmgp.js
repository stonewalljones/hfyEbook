function apply(params, next)
{
    var chap = params.chap;
    var $ = chap.dom;
	var rem = [];
	
    if(chap.title === 'Humans don\’t make good pets 7')
    {
        var ps = $('p');

        rem.push($(ps[0]));
        rem.push($(ps[1]));
    }

    rem.push($('#-'));
    rem.push($('#continued-in-part-2-http-redd-it-2ydy99-'));

    // Remove next / prev chapter link paragraphs and author post-ambles.
    // Also gets rid of inexplicable empty paragraphs.
    $('p').each(function(i, e)
    {
        var el = $(e);

        if(el.find('a').length || el.contents().length < 1)
			rem.push(el);
    });

    // Remove 'All chapter' references
    $('p span').each(function(i, e)
    {
        var el = $(e);

        if(el.text() === 'All chapters')
        	rem.push(el.parent());
    });

    $('h2').each(function(i, e)
    {
        e.name = 'p';
        delete e.attribs['id'];
    });

    var pa = $('hr').last().nextAll();
    var html = $.html(pa);
    
    if(html.length < 500)
    {
    	for(var i = 0; i < pa.length; i++)
    		rem.push($(pa[i]));
    }
    
    params.purge(rem);
    next();
}

module.exports =
{
    apply: apply
};
