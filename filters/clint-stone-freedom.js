function apply(params, next)
{
	var chap = params.chap;
	var $ = chap.dom;
	var rem = [];
	var tr_re = /^translator note:/i;
	var ct_re = /^continued in comments/i;
	
	$('p strong').each(function(i, e)
	{
		var el = $(e);

		if(el.text().search(tr_re) === 0)
			rem.push(el.parent());
	});

	$('p').each(function(i, e)
	{
		var el = $(e);

		if(el.text().search(ct_re) === 0)
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
