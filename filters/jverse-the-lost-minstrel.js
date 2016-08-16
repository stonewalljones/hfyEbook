function apply(params, next)
{
    var chap = params.chap;
	var $ = chap.dom;
	var rem = [];
	var prune = {
		'The Lost Minstrel - 1': [4, 0],
		'The Lost Minstrel - 3': [3, 0],
		'The Lost Minstrel - 4': [5, 0],
		'The Lost Minstrel - 5': [5, 0],
		'The Lost Minstrel - 6': [5, 0],
		'The Lost Minstrel - 7': [8, 0],
		'The Lost Minstrel - 8': [7, 0],
		'The Lost Minstrel - 9': [9, 0],
		'The Lost Minstrel - 10': [1, 0],
		'The Lost Minstrel - 11': [1, 0],
		'The Lost Minstrel - 12': [2, 0],
		'The Lost Minstrel - 14': [2, 0],
		'The Lost Minstrel - 15': [1, 0]
	};
		
	$('h2').each(function(i, e)
	{
		e.name = 'strong';
	});
	
    if(chap.title in prune)
    {
		var pr = prune[chap.title];
		var ps = $('p');
	
		for(var i = 0; i < pr[0]; i++)
			rem.push($(ps[i]));
		
		for(var i = ps.length - pr[1]; i < ps.length; i++)
			rem.push($(ps[i]));
    
    	if(pr.length > 2)
    	{
    		var pats = pr[2];
    		
    		for(var i = 0; i < pats.length; i++)
    		{
    			var res = $(pats[i]);
    			
    			for(var i2 = 0; i2 < res.length; i2++)
    				rem.push($(res[i2]));
    		}
    	}
    }
    
    var date_re = /^##.*##$/;
    
    $('p').each(function(i, e)
    {
        var el = $(e);
        var t = el.text();
        
        if(t.search(date_re) === 0)
        {
            el.text('');
            el.append('<strong>' + t.substr(2, t.length-4) + '</strong>');
        }
        else if(t === '6y 11m 3w 2d BV')
        {
            el.text('');
            el.append('<strong>' + t + '</strong>');
        }
    });
    
    if(rem.length)
	    params.purge(rem);

	next();
}

module.exports =
{
    apply: apply
};
