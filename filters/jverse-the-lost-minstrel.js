const utils = require('./utils');

function apply(params, next)
{
    const chap = params.chap;
	const $ = chap.dom;
	const rem = [];
	
	utils.pruneParagraphs(chap, rem, {
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
		'The Lost Minstrel - 13': [1, 0],
		'The Lost Minstrel - 14': [2, 0],
		'The Lost Minstrel - 15': [1, 0],
		'The Lost Minstrel - 16': [2, 0]
	});
		
	$('h2').each(function(i, e)
	{
		e.name = 'strong';
	});
	
    const date_re = /^##.*##$/;
    
    $('p').each(function(i, e)
    {
        const el = $(e);
        const t = el.text();
        
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
    
    params.purge(rem);
	next();
}

module.exports =
{
    apply: apply
};
