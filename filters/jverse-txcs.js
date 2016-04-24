function apply(params, next)
{
    var chap = params.chap;
    var $ = chap.dom;
	var ps = $('p');
	var rem = [];
	
    if(chap.title === 'Monkeys Reaches Stars')
    {
    	ps.each(function(i, e)
    	{
    		var p = $(e);
    		
    		if(p.text() === '&nbsp')
    			rem.push(p);
    	});
    }
    
    var lp = $(ps[ps.length-1]);
    
    if(lp.text().match(/^Part \w+$/))
    	rem.push(lp);
    
    params.purge(rem);
    next();
}

module.exports =
{
    apply: apply
};
