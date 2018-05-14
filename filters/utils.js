function removeFirst($, coll, selector, count)
{
	let elems = $(selector);

	for(let i = 0; i < count; i++)
	    coll.push($(elems[i]));
}

function removeLast($, coll, selector, count)
{
    let elems = $(selector);
    
    count = Math.min(count, elems.length);
    
    for(let i = elems.length - 1; i > elems.length - (count + 1); i--)
        coll.push($(elems[i]));
}

function removeSingle($, coll, selector)
{
    coll.push($($(selector)[0]));
}

function removeAll($, coll, selector)
{
	let elems = $(selector);

	for(let i = 0; i < elems.length; i++)
	    coll.push($(elems[i]));
}

function removeMatching($, coll, selector, rexp)
{
	$(selector).each(function(i, e)
	{
		let el = $(e);
		let t = el.text();

		if(t.search(rexp) === 0)
			coll.push(el);
	});
}

function pruneParagraphs(chap, coll, params)
{
	let $ = chap.dom;
	
	if(chap.title in params)
	{
		let pr = params[chap.title];
		let ps = $('p');
	
		for(let i = 0; i < pr[0]; i++)
			coll.push($(ps[i]));
		
		for(let i = ps.length - pr[1]; i < ps.length; i++)
			coll.push($(ps[i]));

    	if(pr.length > 2)
    	{
    		const pats = pr[2];
    		
    		for(let i = 0; i < pats.length; i++)
    		{
    			const res = $(pats[i]);
    			
    			for(let i2 = 0; i2 < res.length; i2++)
    				coll.push($(res[i2]));
    		}
    	}
	}
}

module.exports =
{
    removeFirst: removeFirst,
    removeLast: removeLast,
    removeSingle: removeSingle,
    removeAll: removeAll,
    removeMatching: removeMatching,
    pruneParagraphs: pruneParagraphs
};
