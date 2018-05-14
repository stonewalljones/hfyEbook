const utils = require('./utils');

function apply(params, next)
{
    const chap = params.chap;
	const $ = chap.dom;
	const rem = [];

	utils.removeAll($, rem, 'h2');

	if(chap.title === 'The Locals')
	{
		utils.removeFirst($, rem, 'p', 2);
	    utils.removeSingle($, rem, 'p:contains("CONTINUED IN COMMENTS BELOW")'); 
	    utils.removeSingle($, rem, 'p:contains("I felt like adding more. Have an epilogue!")'); 
	    utils.removeAll($, rem, 'h1');
	}
	
	utils.pruneParagraphs(chap, rem, {
	    'Saturday Morning Breakfast': [2, 1],
	    'The Champions Pt II: Tidying Up': [0, 1],
	    'Good Training: Pecking Order': [5, 0],
	    'Good Training: April Fool\'s': [2, 0]
	});

    if(rem.length)
	    params.purge(rem);

	next();
}

module.exports =
{
    apply: apply
};
