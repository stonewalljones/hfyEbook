function apply(params, next)
{
    var chap = params.chap;
	var $ = chap.dom;
	var rem = [];
	var prune = {
		'Part 1': [2, 0],
		'Part 2': [2, 0, ['strong:contains("Continued in comments")']],
		'Part 3': [1, 0],
		'Part 4': [2, 0],
		'Part 5': [2, 0],
		'Part 6': [2, 1],
		'Part 7': [2, 0],
		'Part 8': [3, 0]
	};
		
	var wsre = /^[   ]*/g;
	var qtre = /”+/g;
	var spre = /“ +/g;
	
	$('h2').each(function(i, e)
	{
		var nxt = $(e).next();
		
		if(nxt.length && nxt[0].name === 'hr')
			rem.push($(nxt));

		e.name = 'strong';
		
		var el = $(e);
		
		el.append('<br/>');
		
		var f = el.contents()[0];
		
		if(f.type === 'text')
			f.data = f.data.replace(wsre, '');
	
		var txt = el.text();
		
		if(txt === 'Previous Chapter' || txt === 'Next Chapter')
			rem.push(el);
	});
	
	$('p').each(function(i, e)
	{
		var cont = $(e).contents();
		
		for(var idx = 0; idx < cont.length; idx++)
		{
			var c = cont[idx];
			
			if(c.type === 'text')
			{
				c.data = c.data.replace(wsre, '')
				               .replace(qtre, '”')
				               .replace(spre, '“');
			}
		}
	});
	
    if(chap.title in prune)
    {
		var pr = prune[chap.title];
		var ps = $('p');
	
		for(var i = 0; i < pr[0]; i++)
			rem.push($(ps[i]));
		
		for(var i = ps.length - pr[1]; i < ps.length; i++)
			rem.push($(ps[i]));
    
    	if(pr.length > 2)
    	{
    		var pats = pr[2];
    		
    		for(var i = 0; i < pats.length; i++)
    		{
    			var res = $(pats[i]);
    			
    			for(var i2 = 0; i2 < res.length; i2++)
    				rem.push($(res[i2]));
    		}
    	}
    }
    
    if(chap.title === 'Part 4')
    {
    	var f = $('*:contains("Davi was scrambling through the vent")')[0];
    	
    	f.name = 'p';
    }
    else if(chap.title === 'Part 7')
    {
    	var f = $('*:contains("Bobi, for his part, agreed.")')[0];
    	
    	f.name = 'p';
    }
    
    $('strong').each(function(i, e)
    {
    	var el = $(e);
    	var p = $($.parseHTML('<p></p>'));
    	
    	el.replaceWith(p);
    	p.before('<hr/>');
    	p.append(el);
    });
    
    $('p:contains("+++++")').replaceWith('<hr/>');
    
    if(rem.length)
	    params.purge(rem);

	$('*').contents().each(function(i, e)
	{
	    if(e.type !== 'text')
	        return;
	        
	    e.data = e.data.replace(/&#xA0;/gi, '');
	});
	next();
}

module.exports =
{
    apply: apply
};
