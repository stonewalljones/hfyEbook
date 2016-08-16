function apply(params, next)
{
    var $ = params.chap.dom;
    var hrs = $('hr');
	
    if(hrs.length)
    {
        var pa = null;
		var len = 2500;
		
		if(params.chap['no-preamble-treshold'] !== undefined)
			len = params.chap['no-preamble-treshold'];
		else if(params.spec['no-preamble-treshold'] !== undefined)
			len = params.spec['no-preamble-treshold'];
		
        hrs.each(function(i, e)
        {
            var c = $(e).prevAll();

            if(c.text().length <= len)
                pa = c;
        });

        if(pa)
        {
        	var rem = [];
        	
        	for(var i = 0; i < pa.length; i++)
        		rem.push($(pa[i]));
        	
        	params.purge(rem);
    	}
    }

    next();
}

module.exports =
{
    apply: apply
};
