// The actions of other filters can leave the DOM in an undesirable state,
// this filter attempts to correct these anomalies before final output processing.
// It should always be used as the final stage.
function apply(params, next)
{
    var $ = params.chap.dom;

	// Remove any empty paragraphs
	$('p').each(function(i, e)
	{
		var p = $(e);
		
		if(p.contents().length === 1)
		{
			var cr = p.contents()[0];
			
			if(cr.type === 'text')
			{
				if(cr.data.trim() === '')
					p.remove();
			}
		}
	});

	// Removal of DOM elements tends to leave surrounding
	// newline text nodes, resulting in large gaps in the root.
	var roots = $.root().contents();
	var newl = /^\n*$/;
	var rem = true;
	
	for(var i = 0; i < roots.length; i++)
	{
		var r = roots[i];
		
		if(r.type === 'text' && r.data.search(newl) > -1)
		{
			if(rem)
				$(r).remove();
			
			rem = true;
		}
		else
			rem = false;
	}
	
    // That may leave a single trailing newline
    roots = $.root().contents();
	
	var last = roots[roots.length-1];
	
	if(last.type === 'text' && last.data.search(newl) > -1)
		$(last).remove();
	    
    next();
}

module.exports =
{
    apply: apply
};
