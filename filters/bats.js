const utils = require('./utils');

function apply(params, next)
{
	const chap = params.chap;
	const $ = chap.dom;
	const rem = [];
	
	utils.removeMatching($, rem, 'p', /^continued in (the )*comments/gi); 

	if(['Help I Accidentally the Princess', 'How I Kept Him From Making the Big Orc Cry'].includes(chap.title))
		utils.removeLast($, rem, 'p', 1);
	
	params.purge(rem);
	next();
}

module.exports =
{
    apply: apply
};
