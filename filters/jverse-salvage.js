function apply(params, next)
{
    var chap = params.chap;
    var $ = chap.dom;

    var ps = $('p');
    var fp = $(ps[ps.length - 1]);
	var is_dark_heart = chap.title === 'Dark Heart';
	var rem_asterisk = chap.title === 'Positions of Power' ||
	                   chap.title === 'Prisoners' ||
	                   chap.title === 'Center of attention';
		
	if(is_dark_heart || rem_asterisk)
	{
		ps.each(function(idx, e)
		{
			var cont = $(e).contents();
		
			for(var i = 0; i < cont.length; i++)
			{
				var c = cont[i];
			
				if(c.type === 'text')
				{
					if(is_dark_heart && c.data.charCodeAt(0) === 0x2003)
						c.data = c.data.substr(2, c.data.length-2);
					else if(rem_asterisk && c.data.indexOf('*') > -1)
						c.data = c.data.replace(/\*/, '');
				}
			}
		});
	}
    
    if(fp.text() === 'END OF CHAPTER' || fp.text() === 'Chapter End')
        fp.remove();
    
    next();
}

module.exports =
{
    apply: apply
};
