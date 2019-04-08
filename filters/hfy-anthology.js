const utils = require('./utils');

function apply(params, next)
{
    const chap = params.chap;
    const $ = chap.dom;
	const rem = [];
	
	utils.pruneParagraphs(chap, rem, {
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
		'A Most Peculiar Prisoner': [2, 0],
		'Another Most Peculiar Prisoner': [2, 0],
		'Strategic Buffer Zone': [1, 0],
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
		'Legend of the Exploding Server': [0, 1],
		'Secondary System Online': [1, 0],
		'The Human Experience': [1, 0]
	});
		
    if(rem.length)
	    params.purge(rem);
	
    next();
}

module.exports =
{
    apply: apply
};
