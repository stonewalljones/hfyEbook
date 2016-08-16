function apply(params, next)
{
    var chap = params.chap;
    var $ = chap.dom;
	var rem = [];
	var prune = {
		'A predator subdued': [1, 0],
		'Making an omelet': [0, 1],
		'Winging it': [1, 6],
		'Different Paths': [0, 1],
		'We Are the Gods': [2, 0],
		'Humans are not that special': [0, 2],
		'Adonis': [1, 0],
		'A Difference of 150 nm': [7, 0],
		'The culling pits': [0, 2],
		'Holocene Park': [1, 0],
		'Tis but a scratch': [1, 0],
		'What Price a Word': [2, 0],
		'Human Scientific Methods': [1, 0],
		'Warning: Hitchhikers May Be Escaping Humans': [0, 1],
		'Pancakes': [2, 0],
		'Dead humans rising': [1, 0],
		'Submission': [1, 0],
		'Bait and Switch': [1, 0],
		'See Me In My Office': [3, 0],
		'A God Gets the Bill': [1, 0],
		'What makes humans special? Click here to find out!': [2, 0],
		'R&D': [0, 2, ['h2']],
		'Interrogation Transcript 1209': [0, 1],
		'Chief Engineer Moe': [0, 1],
		'Office Perspectives': [1, 0],
		'The Myth of Men': [0, 1],
		'The Human Speciality': [0, 2],
		'The Legend of the Firearms': [1, 0],
		'Legend of the Exploding Server': [0, 1]
	};
		
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
    
    if(rem.length)
	    params.purge(rem);
	
    next();
}

module.exports =
{
    apply: apply
};
