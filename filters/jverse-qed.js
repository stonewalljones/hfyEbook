const utils = require('./utils');

function apply(params, next)
{
    const $ = params.chap.dom;
	const rem = [];
	
    utils.removeFirst($, rem, 'p', 3);

    $('li p').each(function(i, e)
    {
    	const el = $(e);
    	
    	el.parent().append(el.contents());
    	el.remove();
    });
    
    params.purge(rem);
    next();
}

module.exports =
{
    apply: apply
};
