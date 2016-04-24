function apply(params, next)
{
	var chap = params.chap;
	var $ = chap.dom;
	var rem = [];
	
	$('p strong').each(function(i, e)
	{
		var el = $(e);

		if(el.text().toLowerCase().indexOf('translator note:') === 0)
			rem.push(el.parent());
	});

	$('p').each(function(i, e)
	{
		var el = $(e);

		if(el.text().toLowerCase().indexOf('continued in comments') === 0)
			rem.push(el);
	});

	var rem_last_p = ['Stranger', 'Hand of War', 'Quest', 'Retribution', 'Fireproof', 'Greetings', 'The Feast', 'Undone', 'Susan', 'Lost Tales'];
	var ps = $('p');
	var lp = $(ps[ps.length - 1]);

	if(rem_last_p.indexOf(chap.title) > -1 || lp.find('a').length)
		rem.push(lp);

	if(chap.title === 'Retribution')
		rem.push($(ps[ps.length - 2]));
	else if(chap.title === 'Greetings')
	{
		rem.push($(ps[ps.length - 2]));
		rem.push($(ps[ps.length - 3]));
	}

	params.purge(rem);
	next();
}

module.exports =
{
    apply: apply
};
