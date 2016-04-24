function apply(params, next)
{
	var chap = params.chap;
	var $ = chap.dom;
	var rem = [];
	
	if(chap.title === 'Chapter 1')
		rem.push($('h2'));

	if(chap.title === 'Chapter 6')
	{
		var cn = $.root().children();

		rem.push($(cn[cn.length - 2]));
		rem.push($(cn[cn.length - 1]));
	}
	else
	{
		// Remove link to the next part.
		var ps = $('p');
		var lp = $(ps[ps.length - 1]);
		var cn = lp.contents();

		if(cn[cn.length - 1].name === 'a')
		{
			if(chap.title === 'Chapter 5')
			{
				rem.push($(cn[cn.length - 4]));
				rem.push($(cn[cn.length - 3]));
			}

			rem.push($(cn[cn.length - 2]));
			rem.push($(cn[cn.length - 1]));
		}
	}
	
	$('p').each(function(i, e)
	{
		rem.push($(e).find('br'));
	});

	$('p strong').each(function(i, e)
	{
		var el = $(e);
		
		if(el.text().indexOf('D BV') > -1)
			el.after($('<p></p><br/>'));
	});
	
	params.purge(rem);
	next();
}

module.exports =
{
    apply: apply
};
