function apply(params, next)
{
    var chap = params.chap;
	var $ = chap.dom;
	var rem = [];
	var ps = $('p');
	
	if(chap.title === 'Part 1')
		rem.push($(ps[ps.length - 1]));
	else if(chap.title === 'Part 3')
	{
		rem.push($(ps[0]));
		rem.push($(ps[1]));
		rem.push($(ps[2]));
	}
	else if(chap.title === 'Part 6')
	{
		rem.push($(ps[0]));
		rem.push($(ps[1]));
	}
	else
		rem.push($(ps[0]));
	
	params.purge(rem);
	next();
}

module.exports =
{
    apply: apply
};
