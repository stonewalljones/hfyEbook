function apply(params, next)
{
    var chap = params.chap;
    var title = chap.title;
    var $ = chap.dom;
	var rem = [];
	
    // Remove 'continued in' paragraphs
    $('p span').each(function(i, e)
    {
        var p = $(e).parent();
        var t = p.text();

        if(t.indexOf('Continued ') === 0 || t.indexOf('Concluded ') === 0)
        	rem.push(p);
    });

    $('p').each(function(i, e)
	{
        var p = $(e);
        
        if(p.text().trim() === '')
        	rem.push(p);
	});
	
    var end_m = /^end (chapter|part) \d/i;
    var end_m2 = /^\+\+end[  ](of )*chapter/i;
    var cont_m = /^Continued in Chapter/i;
    
    $('p, p strong').each(function(i, e)
    {
        var p = $(e);
        var t = p.text();
		
    	if(t.search(end_m2) === 0)
    	{
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
    
    if(title.indexOf('Run, little monster') > -1)
    {
        var fp = $($('p')[0]);
        
        fp.text('"' + fp.text());
    }
    else if(title.indexOf('Interlude/Ultimatum') > -1)
    {
        $('pre > code').each(function(i, e)
        {
            $(e).parent().replaceWith($('<hr/>'));
        });
    }
    else if(title.indexOf('The Hornet\'s Nest') > -1)
    {
        $($('p:contains("As you say, Four.")')[0])
            .replaceWith('<p><strong>+0006+:</strong> As you say, Four.</p>');
    }
    else if(title.indexOf('Firebird (pt. 1)') > -1)
    {
        $($('p:contains("I don’t know about you, but this looks like imprisonment")')[0])
            .replaceWith('<p>♪♫<em>"I don’t know about you, but this looks like imprisonment/ what’s worse is that the prisoners don’t know that they’re prisoners/ even defend the…"</em>♫♪</p>');
    }
    else if(title.indexOf('Firebird (pt. 2)') > -1)
    {
        $($('p:contains("in orbit around Cimbrean.")')[0])
            .replaceWith('<p><strong>HMS <em>Myrmidon</em>, in orbit around Cimbrean.</strong></p>');
    }
    else if(title.indexOf('Battles (pt. 4)') > -1)
    {
        $($('p:contains("landed on Planet Ikbrzk.")')[0])
            .replaceWith('<p><strong>“<em>Sanctuary</em>”, landed on Planet Ikbrzk.</strong></p>');
    }
    else if(title.indexOf('Baggage (pt. 3)') > -1)
    {
        $($('p:contains("Deep Space, The Frontier Worlds")')[0])
            .replaceWith('<p><strong>Starship <em>Sanctuary</em>, Deep Space, The Frontier Worlds</strong></p>');
    }
    else if(title.indexOf('Baggage (pt. 4)') > -1)
    {
        $($('p:contains("orbiting Cimbrean, The Far Reaches")')[0])
            .replaceWith('<p><strong><em>Firebird</em>, orbiting Cimbrean, The Far Reaches</strong></p>');
    }
    else if(title.indexOf('Baptisms (pt. 2)') > -1)
    {
        $($('p:contains("Clan Fastpaw Orbital Defence")')[0])
            .replaceWith('<p><strong>Clan Fastpaw Orbital Defence station “<em>Pride and Vision</em>”, Orbiting Planet Gorai.</strong></p>');
    }
    else if(title.indexOf('Exorcisms (pt. 4)') > -1 || 
            title.indexOf('Exorcisms (pt. 5)') > -1 ||
            title === 'Warhorse')
    {
        var ps = $('p');
        
        rem.push($(ps[ps.length - 1]));
    }
    else if(title.indexOf('Dragon Dreams (pt. 4)') > -1)
    {
        var ps = $('p');
        
        for(var i = ps.length - 6; i < ps.length; i++)
            rem.push($(ps[i]));
    }
    else if(title.indexOf('Operation NOVA HOUND') > -1 || 
            title.indexOf('Back Down To Earth') > -1)
    {
        var ps = $('p');
        
        for(var i = ps.length - 2; i < ps.length; i++)
            rem.push($(ps[i]));
    }
    else if(title.indexOf('Warhorse') > -1)
    {
    	var ws_re = /[ \t\r\n]+/g;
    	
    	$('p').each(function(i, e)
    	{
    		var cont = $(e).contents();
    		
    		for(var i = 0; i < cont.length; i++)
    		{
    			var c = cont[i];
    			
    			if(c.type === 'text')
    				c.data = c.data.replace(ws_re, ' ');
    		}
    	});
    }
    
    params.purge(rem);
    next();
}

module.exports =
{
    apply: apply
};
