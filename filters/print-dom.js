function filter_txt(txt)
{
	return txt.replace(/\n/g, '\\n');
}

function display($, indent, root)
{
	const cont = root.contents();
	
	for(let i = 0; i < cont.length; i++)
	{
		const c = cont[i];
		
		if(c.type === 'tag')
		{
			console.log(indent + '<' + c.name + '>');
			display($, indent + '    ', $(c));
			console.log(indent + '</' + c.name + '>');
		}
		else if(c.type === 'text')
			console.log(indent + '[' + (c.data.length < 40 ? filter_txt(c.data) : '...') + ']');
		else
			console.log(indent + '[' + c.type.toUpperCase() + ']');
	}
}

function apply(params, next)
{
    const $ = params.chap.dom;

    display($, '', $.root());
    next();
}

module.exports =
{
    apply: apply
};
