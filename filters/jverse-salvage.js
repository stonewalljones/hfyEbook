function processText($, fn)
{
    $('p').each(function(idx, e)
    {
        const cont = $(e).contents();
        
        for(let i = 0; i < cont.length; i++)
        {
            const c = cont[i];
            
            if(c.type === 'text')
                fn(c); 
        }
    });
}

function apply(params, next)
{
    const chap = params.chap;
    const $ = chap.dom;
    
	if(chap.title === 'Dark Heart')
	{
	    processText($, function(c)
	    {
	        if(c.data.charCodeAt(0) === 0x2003)
		        c.data = c.data.substr(2, c.data.length-2);
	    });
	}
	else if(['Positions of Power', 'Prisoners', 'Center of attention'].includes(chap.title))
	{
	    processText($, function(c)
	    {
	        if(c.data.indexOf('*') > -1)
		        c.data = c.data.replace(/\*/, '');
	    });
	}
    
    const rem = [];
    const ps = $('p');
    const prune_chapter = [
        'The Fittest',
        'The Rabbit Hole',
        'Solve for X-plosion',
        'Going Without',
        'Lost Futures'
    ].includes(chap.title);
    
    if(prune_chapter)
    {
        for(let i = 0; i < 2; i++)
            rem.push($(ps[i]));
    }
    
    const fp = $(ps[ps.length - 1]);

    if(fp.text() === 'END OF CHAPTER' || fp.text() === 'End of Chapter' || fp.text() === 'Chapter End')
        rem.push(fp);
    
    params.purge(rem);    
    next();
}

module.exports =
{
    apply: apply
};
