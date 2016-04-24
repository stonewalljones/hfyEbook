var cheerio = require('cheerio');
var fs = require('fs');

var ERROR_TAG = '[\033[91mError\033[0m]: ';
var DEBUG = false;

if(process.argv.length < 3)
{
    console.log('Usage: ebook.js <spec.json>');
    return;
}

function ensure_dir(dir)
{
	dir = __dirname + '/' + dir;
	
	if(!fs.existsSync(dir))
		fs.mkdirSync(dir);
}

// Ensure the 'cache' and 'output' directories exists. Create them if they do not.
ensure_dir('cache');
ensure_dir('output');

function decode_cr(cr)
{
	var ishex = cr[2] === 'x';
	
	return String.fromCodePoint(parseInt(cr.substr(ishex ? 3 : 2, cr.length - 2), ishex ? 16 : 10));
}

// Decode all HTML character references to unicode.
function decode_crs(s)
{
	var i = -1;
	var ls = s;
	
	while((i = ls.search(/&#.*;/)) > -1)
	{
		var ni = ls.indexOf(';', i);
		
		ls = ls.substr(0, i) + decode_cr(ls.substr(i, ni - i + 1)) + ls.substr(ni + 1);
	}
	
	return ls;
}

function unescape_html(html)
{
    return decode_crs(html.replace(/&amp;/g, '&'))
                          .replace(/&quot;/g, '"')
    	                  .replace(/&apos;/g, '\'')
    	                  .replace(/&nbsp;/g, ' ')
    	                  .replace(/&#39;/g, '\'')
    	                  .replace(/&amp;#39;/g, '\'')
    	                  .replace(/&amp;/g, '&');
}

function purge(set)
{
	for(var i = 0; i < set.length; i++)
	{
		var e = set[i];
		
		if(DEBUG)
			console.log('[\033[91mDELETE\033[0m]: [' + e.text() + ']');
			
		e.remove();
	}
}

function FilterManager()
{
    this.filters = {};

    var files = fs.readdirSync(__dirname + '/filters');

    for(var i = 0; i < files.length; i++)
    {
        var fname = files[i];
        var fid = fname.substr(0, fname.length - 3);

        this.filters[fid] = require('./filters/' + fid);
    }
}

FilterManager.prototype.get = function(fid)
{
    var filter = this.filters[fid];

    if(!filter)
    {
        console.log(ERROR_TAG + 'No such filter: ' + fid);
        process.exit();
    }

    return filter.apply;
};

var filter_mgr = new FilterManager();

function Finalize(params)
{
    var spec = params.spec;

    if(++spec.loaded === spec.contents.length)
    {
        params.chap = null;

        if(spec.output.constructor === String)
            filter_mgr.get(spec.output)(params, function(){});
        else if(spec.output instanceof Array)
        {
            var ops = [];

            for(var i = 0; i < spec.output.length; i++)
                ops.push(filter_mgr.get(spec.output[i]));

            Sequence(ops, params);
        }
        else
            console.log(ERROR_TAG + 'Unable to interpret the output filter reference. It must be either a string or array of strings.');
    }
}

function Sequence(ops, params)
{
    if(ops.length < 2)
        throw new Exception(ERROR_TAG + 'Cannot create a sequence of less than two operations.');

    var last = function(params) { return function() { Finalize(params); }; }(params);

    for(var i = ops.length - 1; i >= 0; i--)
        last = function(cur, nxt) { return function() { cur(params, nxt); }; }(ops[i], last);

    last();
}

// Load the spec. Start processing.
var spec = JSON.parse(fs.readFileSync(__dirname + '/' + process.argv[2]));

spec.loaded = 0;

for(var i = 0; i < spec.contents.length; i++)
{
	var chap = spec.contents[i];
    var params = {
        spec: spec,
        chap: chap,
    	unescape_html: unescape_html,
    	purge: purge
    };

    if(typeof(chap.title) !== 'string')
    {
    	console.log(ERROR_TAG + 'Each chapter must contain a "title" property (string).');
    	return;
    }
    
    if(typeof(chap.src) !== 'string')
    {
    	console.log(ERROR_TAG + 'Each chapter must contain a "src" property (string).');
    	return;
    }

    params.chap.id = '' + i;
    params.chap.dom = cheerio.load('');

    var ops = [];
	var filter_type = Object.prototype.toString.call(spec.filters);
	
    if(filter_type === '[object Array]')
    {
		for(var fi = 0; fi < spec.filters.length; fi++)
		    ops.push(filter_mgr.get(spec.filters[fi]));
    }
	else if(filter_type === '[object Object]')
	{
		
		if(typeof(chap.filters) !== 'string')
		{
			console.log(ERROR_TAG + 'In "' + chap.title + '": When a collection of filters is specified, each chapter must also specify witch filter chain to use.');
			return;
		}
		
		if(!(chap.filters in spec.filters))
		{
			console.log(ERROR_TAG + 'In "' + chap.title + '"; Cannot resolve the filter chain "' + chap.filters + '".');
			return;
		}
		
		var filters = spec.filters[chap.filters];
		
		for(var fi = 0; fi < filters.length; fi++)
		    ops.push(filter_mgr.get(filters[fi]));
	}
	else
	{
		console.log(ERROR_TAG + 'Unsupported filter chain type "' + filter_type + '".');
		return;
	}
		
    Sequence(ops, params);
}
