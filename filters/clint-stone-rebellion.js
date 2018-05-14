const utils = require('./utils');

function apply(params, next)
{
	const chap = params.chap;
	const $ = chap.dom;
	const rem = [];

	utils.removeMatching($, rem, 'p strong', /^translator note:/i);
    utils.removeMatching($, rem, 'p', /continued in comments/i);

	const rem_last_p = [
	    'The Pit', 
	    'Purpose', 
	    'Sister', 
	    'Home Run', 
	    'Crazy Bastard', 
	    'Marooned', 
	    'Brother Mine', 
	    'Dark', 
	    'Puzzles', 
	    'Family Values', 
	    'Rebellion of Skuar', 
	    'Enlisted', 
	    'Acceptable', 
	    'Training Mission', 
	    'Liberated', 
	    'Break', 
	    'Breakfast'
	];
	
	const rem_last_p2 = [
	    'Purpose', 
	    'Crazy Bastard'
	];
	
	const ps = $('p');

	if(rem_last_p.includes(chap.title))
		rem.push($(ps[ps.length - 1]));

	if(rem_last_p2.includes(chap.title))
		rem.push($(ps[ps.length - 2]));

	if(['Evaluation', 'Captive', 'Behold'].includes(chap.title))
	{
		for(let i = 0; i < 2; i++)
			rem.push($(ps[ps.length - (i + 1)]));
	}
	else if(['Broken', 'The Lives We Lived'].includes(chap.title))
	{
		for(let i = 0; i < 3; i++)
			rem.push($(ps[ps.length - (i + 1)]));
	}

	params.purge(rem);
	next();
}

module.exports =
{
    apply: apply
};
