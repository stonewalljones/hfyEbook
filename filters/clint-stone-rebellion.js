function apply(params, next)
{
	var chap = params.chap;
	var $ = chap.dom;
	var rem = [];
	var tr_re = /^translator note:/i;
	var ct_re = /continued in comments/i;
	
	$('p strong').each(function(i, e)
	{
		var el = $(e);

		if(el.text().search(tr_re) === 0)
			rem.push(el.parent());
	});

	$('p').each(function(i, e)
	{
		var el = $(e);
		var idx = el.text().search(ct_re);

		if(idx > -1 && idx < 2)
			rem.push(el);
	});

	var rem_last_p = ['The Pit', 'Purpose', 'Sister', 'Home Run', 'Crazy Bastard', 'Marooned', 'Brother Mine', 'Dark', 'Puzzles', 'Family Values', 'Rebellion of Skuar', 'Enlisted', 'Acceptable', 'Training Mission', 'Liberated', 'Break', 'Breakfast'];
	var rem_last_p2 = ['Purpose', 'Crazy Bastard'];
	var ps = $('p');

	if(rem_last_p.indexOf(chap.title) > -1)
		rem.push($(ps[ps.length - 1]));

	if(rem_last_p2.indexOf(chap.title) > -1)
		rem.push($(ps[ps.length - 2]));

	if(chap.title === 'Evaluation' ||
	   chap.title === 'Captive' || 
	   chap.title === 'Behold')
	{
		for(var i = 0; i < 2; i++)
			rem.push($(ps[ps.length - (i + 1)]));
	}
	
	if(chap.title === 'Broken' || 
	   chap.title === 'The Lives We Lived')
	{
		for(var i = 0; i < 3; i++)
			rem.push($(ps[ps.length - (i + 1)]));
	}

	params.purge(rem);
	next();
}

module.exports =
{
    apply: apply
};
