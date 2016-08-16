function apply(params, next)
{
    var chap = params.chap;
	var $ = chap.dom;
	var t = chap.title.substr(0, 2);
	var t2 = chap.title.substr(4, 2); // Fourbags
	var rem = [];
	var chap_is = function(n) { var v = '' + n + '.'; return v === t || v === t2 };
	
	if(chap_is(1))
	{
		// Remove double spacing
	    $('p').each(function(i, e)
	    {
	        if(e.name !== 'p')
	            return;

	        var el = $(e);
	        var tx = el.text().trim();

	        if(tx === '&amp;nbsp;')
	            rem.push(el);
	    });
	}
	else if(chap_is(2))
	{
		var ps = $('p');

		for(var i = 0; i < 5; i++)
			rem.push($(ps[i]));
	}
	else if(chap_is(5) || chap_is(6) || chap_is(7))
	{
		var ps = $('p');

		for(var i = 0; i < 3; i++)
			rem.push($(ps[i]));

		rem.push($('h2'));
	}

	$('p strong').each(function(i, e)
	{
		var el = $(e);

		if(el.text().indexOf('Chapter ') === 0)
			rem.push(el.parent());
	});

	$('p span').each(function(i, e)
	{
		var el = $(e);

		if(el.text().toLowerCase().indexOf('part ') === 0)
			rem.push(el);
	});

	params.purge(rem);
	next();
}

module.exports =
{
    apply: apply
};
