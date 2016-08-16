var ENT_LQUOT = '&#x201C;';
var ENT_RQUOT = '&#x201D;';
var ENT_SQUOR = '&#x2019;';
var ENT_SQUOL = '&#x2018;';
var ENT_NDASH = '&#x2013;';
var ENT_MDASH = '&#x2014;';
var ENT_ASTER = '&#x2042;';
var ENT_ELLIP = '&#x2026;';
var ENT_LTHAN = '&#x003C;';
var ENT_GTHAN = '&#x003E;';
var ENT_AMPER = '&#x0026;';

function apply(params, next)
{
    var $ = params.chap.dom;
    var last_open = false;
    var last_open_s = false;
    var last_char = '';

    $('*').each(function(i1, e1)
    {
        $(e1).contents().each(function(i2, e2)
        {
            if(e2.type !== 'text' || !e2.data)
                return;

            var is = e2.data;
            var os = '';

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
            for(var i = 0; i < is.length; i++)
            {
                var c = is[i];

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
                    var ss = is.substr(i, 20);

                    if(!ss.match(/^&.*;/))
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
    var flatten_mono = function(i, e)
    {
        var el = $(e);
        var parent = el.parent();

        parent.text(el.text());
        el.remove();
    };

    $('pre > code').each(flatten_mono);
    $('code > pre').each(flatten_mono);

    // Remove redundant horizontal rules
    var brem = false;
	var rem = [];

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

    // Replace horizontal rules with nice breaks
    $('hr').each(function(i, e)
    {
        var el = $(e);

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
