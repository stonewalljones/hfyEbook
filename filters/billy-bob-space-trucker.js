function apply(params, next)
{
    var chap = params.chap;
	var $ = chap.dom;
	var c_re = /^ *Chapitre [a-z,A-Z,-]*\.*\n*/g;
	var rem = [];
	
	// Remove spurious chapter headings without removing body text that may
	// share an enclosing paragraph with the heading.
	$('p').each(function(i, e)
 	{
		var cont = $(e).contents();
		
		for(var i = 0; i < cont.length; i++)
		{
			var c = cont[i];
			
			if(c.type === 'text' && c.data.search(c_re) > -1)
				c.data = c.data.replace(c_re, '');
		}
 	});
 		
	// Harmonize catch-phrase formatting.
	if(chap.title === 'Un' || chap.title === 'Deux')
		$('pre').replaceWith($('<p><strong>Billy-Bob Space Trucker</strong></p>\n'));
	else if(chap.title === 'Trois')
		$.root().find('p strong').text('Billy-Bob Space Trucker');
	else if(chap.title === 'Dix-sept')
		rem.push($($('p:contains("Edit I hates they spelling yarr")')[0]));
	else if(chap.title === 'Dix-huit')
	{
		rem.push($($('p:contains("Edit fix: Got overzealous with copy paste")')[0]));
		rem.push($($('p:contains("Edit. Thought and FLT")')[0]));
	}
	else if(chap.title === 'Falling from on high')
	{
		var fp = $('p').first();
		
		fp.text(fp.text().replace(/Falling from on high\n/, ''));
	}
	
	// Filter various pre- and postamble paragraphs.
	var prune = {
		'Dix-sept': [0, 1],
		'Dix-neuf': [0, 1],
		'Vingt-et-un': [1, 0],
		'Vingt-deux': [1, 0],
		'Vingt-Six': [0, 1],
		'Vingt-Sept': [4, 1],
		'Trente-Cinq première partie': [0, 1],
		'Trente-cinq deuxième partie': [1, 0]
	};
	
	if(chap.title in prune)
	{
		var pr = prune[chap.title];
		var ps = $('p');
	
		for(var i = 0; i < pr[0]; i++)
			rem.push($(ps[i]));
		
		for(var i = ps.length - pr[1]; i < ps.length; i++)
			rem.push($(ps[i]));
	}
	
	params.purge(rem);
	
	next();
}

module.exports =
{
    apply: apply
};
