var ENT_LQUOT = '“';
var ENT_RQUOT = '”';
var ENT_SQUOR = '’';
var ENT_SQUOL = '‘';
var ENT_NDASH = '–';
var ENT_ASTER = '⁂';
var ENT_ELLIP = '…';

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
                        last_open_s = false;
                    }
                }
                else if(c === '&')
                    os += '&amp;';
                else if(c === '-')
                    os += ENT_NDASH;
                else
                    os += c;

                last_char = c;
            }

            os = os.replace(/\.\.\./g, ENT_ELLIP)
                   .replace(/ \. \. \./g, ENT_ELLIP)
                   .replace(/\. \. \./g, ENT_ELLIP)
                   .replace(/&lt;/g, '<')
                   .replace(/&rt;/g, '>')
                   .replace(/&emsp;/g, '');

            e2.data = os;
        });
    });

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
            el.replaceWith('<p><center>' + ENT_ASTER + '</center></p>');
    });

	params.purge(rem);
    next();
}

module.exports =
{
    apply: apply
};
