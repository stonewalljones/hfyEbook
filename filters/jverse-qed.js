function apply(params, next)
{
    var $ = params.chap.dom;
    var ps = $('p');
	var rem = [];
	
    for(var i = 0; i < 3; i++)
        rem.push($(ps[i]));

    $('li p').each(function(i, e)
    {
    	var el = $(e);
    	
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
