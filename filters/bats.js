function apply(params, next)
{
	var chap = params.chap;
	var $ = chap.dom;
	var ps = $('p');
	var rem = [];
	var cmt_re = /^continued in (the )*comments/gi;
	
	ps.each(function(i, e)
	{
		var el = $(e);
		var t = el.text();

		if(t.search(cmt_re) === 0)
			rem.push(el);
	});

	if(chap.title === 'Help I Accidentally the Princess' || 
	   chap.title === 'How I Kept Him From Making the Big Orc Cry')
	{
		rem.push($(ps[ps.length - 1]));
	}
	
	params.purge(rem);
	next();
}

module.exports =
{
    apply: apply
};
