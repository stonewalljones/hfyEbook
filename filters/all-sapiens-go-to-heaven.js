const utils = require('./utils');

function apply(params, next)
{
    const chap = params.chap;
	const $ = chap.dom;
	const rem = [];
	
	if(chap.title === 'Part 1')
	    utils.removeLast($, rem, 'p', 1);
	else if(chap.title === 'Part 3' || chap.title === 'Part 20')
	    utils.removeFirst($, rem, 'p', 3);
	else if(['Part 6', 'Part 18', 'Part 22'].includes(chap.title))
	    utils.removeFirst($, rem, 'p', 2);
	else
	    utils.removeFirst($, rem, 'p', 1);
	
	params.purge(rem);
	next();
}

module.exports =
{
    apply: apply
};
