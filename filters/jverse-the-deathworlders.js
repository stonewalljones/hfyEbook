function apply(params, next)
{
    const chap = params.chap;
    const title = chap.title;
    const $ = chap.dom;
	const rem = [];

    // Remove 'continued in' paragraphs
    $('p span').each(function(i, e)
    {
        const p = $(e).parent();
        const t = p.text();

        if(t.indexOf('Continued ') === 0 || t.indexOf('Concluded ') === 0)
        	rem.push(p);
    });

    // Remove date posted and reading time estimation
    $('aside').each(function(i,e){
      rem.push($(e));
    });

    // Remove redundant title
    $("h1").each(function(i,e){
        if($(e).text().indexOf('Chapter')===0){
          rem.push($(e));
        }
    });
    
    $('p').each(function(i, e)
	{
        const p = $(e);

        if(p.text().trim() === '')
        	rem.push(p);
	});

    const end_m = /^\+*end (chapter|part) \d/i;
    const end_m2 = /^\+\+end([  ]|&nbsp;)(of )*chapter/i;
    const cont_m = /^Continued in Chapter/i;

    $('p, p strong').each(function(i, e)
    {
        const p = $(e);
        const t = p.text();

    	if(t.search(end_m2) === 0)
    	{
    		console.log('R: ' + t);
    		rem.concat(p.nextAll());
    		rem.push(p);
    	}
		else if(t.search(end_m) === 0)
    		rem.push(p);
		else if(t.search(cont_m) === 0)
    		rem.push(p);

	    if(title === 'Deliverance')
	    {
		    if(t === 'Four years previously.')
		    	p.parent().html('<strong>Four years previously.</strong>');
		    else if(t === '__' || t === 'End chapter 5')
		    	rem.push(p);
	    }
    });

    if(title === 'Run, little monster')
    {
        const fp = $($('p')[0]);

        fp.text('"' + fp.text());
    }
    else if(title === 'Interlude/Ultimatum')
    {
        $('pre > code').each(function(i, e)
        {
            $(e).parent().replaceWith($('<hr/>'));
        });
    }
    else if(title === 'The Hornet\'s Nest')
    {
        $($('p:contains("As you say, Four.")')[0])
            .replaceWith('<p><strong>+0006+:</strong> As you say, Four.</p>');
    }
    else if(title === 'Firebird (pt. 1)')
    {
        $($('p:contains("I don’t know about you, but this looks like imprisonment")')[0])
            .replaceWith('<p>♪♫<em>"I don’t know about you, but this looks like imprisonment/ what’s worse is that the prisoners don’t know that they’re prisoners/ even defend the…"</em>♫♪</p>');
    }
    else if(title === 'Firebird (pt. 2)')
    {
        $($('p:contains("in orbit around Cimbrean.")')[0])
            .replaceWith('<p><strong>HMS <em>Myrmidon</em>, in orbit around Cimbrean.</strong></p>');
    }
    else if(title === 'Battles (pt. 4)')
    {
        $($('p:contains("landed on Planet Ikbrzk.")')[0])
            .replaceWith('<p><strong>“<em>Sanctuary</em>”, landed on Planet Ikbrzk.</strong></p>');
    }
    else if(title === 'Baggage (pt. 3)')
    {
        $($('p:contains("Deep Space, The Frontier Worlds")')[0])
            .replaceWith('<p><strong>Starship <em>Sanctuary</em>, Deep Space, The Frontier Worlds</strong></p>');
    }
    else if(title === 'Baggage (pt. 4)')
    {
        $($('p:contains("orbiting Cimbrean, The Far Reaches")')[0])
            .replaceWith('<p><strong><em>Firebird</em>, orbiting Cimbrean, The Far Reaches</strong></p>');
    }
    else if(title === 'Baptisms (pt. 2)')
    {
        $($('p:contains("Clan Fastpaw Orbital Defence")')[0])
            .replaceWith('<p><strong>Clan Fastpaw Orbital Defence station “<em>Pride and Vision</em>”, Orbiting Planet Gorai.</strong></p>');
    }
    else if(['Exorcisms (pt. 4)', 'Exorcisms (pt. 5)'].includes(title))
    {
        const ps = $('p');

        rem.push($(ps[ps.length - 1]));
    }
    else if(title === 'Dragon Dreams (pt. 4)')
    {
        const ps = $('p');

        for(let i = ps.length - 6; i < ps.length; i++)
            rem.push($(ps[i]));
    }
    else if(['Operation NOVA HOUND', 'Back Down To Earth', 'Metadyskolia'].includes(title))
    {
        const ps = $('p');

        for(let i = ps.length - 2; i < ps.length; i++)
            rem.push($(ps[i]));
    }
    else if(title.indexOf('Warhorse') > -1)
    {
        const ps = $('p');
    	const ws_re = /[ \t\r\n]+/g;

    	ps.each(function(i, e)
    	{
    		const cont = $(e).contents();

    		for(let i = 0; i < cont.length; i++)
    		{
    			const c = cont[i];

    			if(c.type === 'text')
    				c.data = c.data.replace(ws_re, ' ');
    		}
    	});

        rem.push($(ps[ps.length - 1]));
    }
    else if(title === 'Event Horizons')
    {
	    const ps = $($('p:contains("patreon.com")')[0]).prev().nextAll();

	    for(let i = 0; i < ps.length; i++)
		    rem.push($(ps[i]));
    }

    if(['Event Horizons',
        'Consequences',
        'Grounded',
        'Paroxysm',
        'The Nirvana Cage',
        'War On Two Worlds: Instigation',
        'War On Two Worlds: Escalation'].includes(title))
    {
    	const ps = $($('p:contains("If you have enjoyed the story so far")')[0]).prev().prev().prev().nextAll();

	    for(let i = 0; i < ps.length; i++)
    		rem.push($(ps[i]));
    }

    params.purge(rem);
    next();
}

module.exports =
{
    apply: apply
};
