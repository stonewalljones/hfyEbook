const utils = require('./utils');

function apply(params, next)
{
    const chap = params.chap;
	const $ = chap.dom;
	const chap_nb = parseInt(chap.title.substr(0, chap.title.indexOf('.')), 10);
	const rem = [];
	
	if(chap_nb === 1)
	{
		// Remove double spacing
	    $('p').each(function(i, e)
	    {
	        if(e.name !== 'p')
	            return;

	        const el = $(e);

	        if(el.text().trim() === '&amp;nbsp;')
	            rem.push(el);
	    });
	}
    
	utils.pruneParagraphs(chap, rem, {
	    '1. Awakening': [4, 0],
	    '2. Profiling': [5, 0],
	    '3. Briefing': [2, 0],
	    '4. Augmenting': [3, 0],
	    '5. Tracking': [3, 0, ['h2']],
	    '6. The Chase': [3, 0, ['h2']],
	    '7. Challenges': [3, 0, ['h2']],
	    '8. Demons': [1, 0],
	    '9. Unleashed': [2, 0],
	    '10. Seeds of Rebellion': [2, 0],
	    '11. The Army Rises': [2, 0],
	    '12. Timing': [2, 0],
	    '13. The Plunge': [2, 0],
	    '14. Firestorm (pt. 1)': [3, 0],
	    '14. Firestorm (pt. 2)': [4, 0],
	    '14. Firestorm (pt. 3)': [3, 0],
	    '15. Paranoia': [3, 0],
	    '16. Suspicion': [2, 0],
	    '17. Back and Forth': [2, 0],
	    '18. Blood and Lies': [2, 0],
	    '19. Into the Fire': [2, 0],
	    '20. Misdirection': [2, 0],
	    '21. Idle Hands': [2, 0],
	    '22. The Broken World': [3, 0],
	    '23. Survive': [2, 0],
	    '24. Run': [2, 0],
	    '25. Tunnels of the Dead': [2, 0],
	    '26. Necropolis': [2, 0],
	    '27. Silence': [4, 0],
	    '28. The Door': [6, 0]
	});
	
	if(chap_nb > 7 || chap_nb === 1 || chap_nb === 4)
	    utils.removeFirst($, rem, 'hr', 1);
	
	$('p strong').each(function(i, e)
	{
		const el = $(e);

		if(el.text().indexOf('Chapter ') === 0)
			rem.push(el.parent());
	});

	$('p span').each(function(i, e)
	{
		const el = $(e);

		if(el.text().toLowerCase().indexOf('part ') === 0)
			rem.push(el);
	});

	params.purge(rem);
	next();
}

module.exports =
{
    apply: apply
};
