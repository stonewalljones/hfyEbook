function apply(params, next)
{
   var chap = params.chap;
	var $ = chap.dom;
	var header_re = /CHAPTER/g;
	var footer_re = /Chapter [A-Z,a-z]*/g;
	var rem = [];
	
	$('p strong').each(function(i, e)
 	{
		var cont = $(e).contents();
		
		for(var i = 0; i < cont.length; i++)
		{
			var c = cont[i];
			
         //This is a link that has already been removed, dig to find the real element
         if(c.type === 'tag' && c.name === 'span')
         {
            c = c.children[0];
         }

			if(c.type === 'text')
         {
            if (c.data.search(header_re) > -1)
            { //Remove all header information, this is everything preceeding and including the "CHAPTER .*" line
               up = $(e).parents('p')
               rem.push(up)
               var pa = up.prevAll();
               for(var i = 0; i < pa.length; i++)
                  rem.push($(pa[i]));
            }
            else if (c.data.search(footer_re) > -1)
            { //Remove next chapter link
               up = $(e).parents('p')
               rem.push(up);
            }

         }
      }
 	});

	params.purge(rem);
	next();
}

module.exports =
{
    apply: apply
};
