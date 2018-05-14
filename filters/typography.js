const ENT_LQUOT = '&#x201C;';
const ENT_RQUOT = '&#x201D;';
const ENT_SQUOR = '&#x2019;';
const ENT_SQUOL = '&#x2018;';
const ENT_NDASH = '&#x2013;';
const ENT_MDASH = '&#x2014;';
const ENT_ASTER = '&#x2042;';
const ENT_ELLIP = '&#x2026;';
const ENT_LTHAN = '&#x003C;';
const ENT_GTHAN = '&#x003E;';
const ENT_AMPER = '&#x0026;';

function apply(params, next)
{
    const $ = params.chap.dom;
    let last_open = false;
    let last_open_s = false;
    let last_char = '';

    $('*').each(function(i1, e1)
    {
        $(e1).contents().each(function(i2, e2)
        {
            if(e2.type !== 'text' || !e2.data)
                return;

            let is = e2.data;
            let os = '';

            // If the source text contains any named entities, replace them
            // with their numerical equivalents before further processing.
            // Replace quotes with non-typographical equivalents.
            is = is.replace(/&quot;/g, '"')
                   .replace(/&apos;/g, '\'')
                   .replace(/&amp;/g, ENT_AMPER)
                   .replace(/&ndash;/g, ENT_NDASH)
                   .replace(/&mdash;/g, ENT_MDASH)
                   .replace(/&lsquo;/g, ENT_SQUOL)
                   .replace(/&rsquo;/g, ENT_SQUOR)
                   .replace(/&ldquo;/g, '"')
                   .replace(/&rdquo;/g, '"')
                   .replace(/&hellip;/g, ENT_ELLIP)
                   .replace(/&lt;/g, ENT_LTHAN)
                   .replace(/&gt;/g, ENT_GTHAN)
                   .replace(/&emsp;/g, '')
                   .replace(/&nbsp;/g, ' ');

            // Replace ordinary single and double quotes with their typographical
            // equivalents. This approach assumes english content.
            for(let i = 0; i < is.length; i++)
            {
                const c = is[i];

                if(c === '"')
                {
                    if(!last_open || last_char === ' ')
                    {
                        os += ENT_LQUOT;
                        last_open = true;
                    }
                    else
                    {
                        os += ENT_RQUOT;
                        last_open = false;
                    }
                }
                else if(c === '\'')
                {
                    if(!last_open_s && last_char === ' ')
                    {
                        os += ENT_SQUOL;
                        last_open_s = true;
                    }
                    else
                    {
                        os += ENT_SQUOR;

                        if(i === is.length - 1 || is[i + 1] === ' ') // Check for contractions
                            last_open_s = false;
                    }
                }
                else if(c === '&')
                {
                    if(!is.substr(i, 20).match(/^&.*;/))
                        os += ENT_AMPER;
                    else
                        os += '&';
                }
                else if(c === '-')
                    os += ENT_NDASH;
                else
                    os += c;

                last_char = c;
            }

            // Replace full-stop runs with ellipseses.
            os = os.replace(/\.\.\./g, ENT_ELLIP)
                   .replace(/ \. \. \./g, ENT_ELLIP)
                   .replace(/\. \. \./g, ENT_ELLIP);

            e2.data = os;
        });
    });

	// Flatten nested monospace tags
    const flatten_mono = function(i, e)
    {
        const el = $(e);
        const parent = el.parent();

        parent.text(el.text());
        el.remove();
    };

    $('pre > code').each(flatten_mono);
    $('code > pre').each(flatten_mono);

    // Remove redundant horizontal rules
    let brem = false;

    $.root().children().each(function(i, e)
    {
        if(e.name === 'hr')
        {
            if(brem)
                $(e).remove();
			else
            	brem = true;
        }
        else if(e.name === 'p')
            brem = false;
    });

	const rem = [];

    // Replace horizontal rules with nice breaks
    $('hr').each(function(i, e)
    {
        const el = $(e);

        // Don't insert break as the first or last element
        if(el.prevAll().length < 1 || el.nextAll().length < 1)
            rem.push(el);
        else
            el.replaceWith('<p class="center">' + ENT_ASTER + '</p>');
    });

	params.purge(rem);
    next();
}

module.exports =
{
    apply: apply
};
