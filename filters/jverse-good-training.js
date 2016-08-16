function apply(params, next)
{
    var chap = params.chap;
	var $ = chap.dom;
	var rem = [];
	var ps = $('p');

	$('h2').each(function(i, e)
	{
		rem.push($(e));
	});

	/*$('blockquote').each(function(i, e)
	{
        e.name = 'pre';
	});*/

	if(chap.title === 'The Locals' || chap.title === 'Good Training: The Locals')
	{
		rem.push($(ps[0]));
		rem.push($(ps[1]));
	    rem.push($('p:contains("CONTINUED IN COMMENTS BELOW")'));
	    rem.push($('p:contains("I felt like adding more. Have an epilogue!")'));
	}
	else if(chap.title === 'Saturday Morning Breakfast' || chap.title === 'Good Training: Saturday Morning Breakfast')
	{
		rem.push($(ps[0]));
		rem.push($(ps[1]));
	}

    if(rem.length)
	    params.purge(rem);

	next();
}

module.exports =
{
    apply: apply
};
