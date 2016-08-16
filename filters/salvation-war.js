function to_html($, el, ctx)
{
	var cont = el.contents();
	var html = '';
		
	for(var i = 0; i < cont.length; i++)
	{
		var c = cont[i];
		
		if(c.type === 'tag')
		{
			if(c.name === 'br')
			{
				var nxt_is_br = false;
				
				if(i < cont.length - 1)
				{
					var nxt = cont[i + 1];
					
					nxt_is_br = nxt.type === 'tag' && nxt.name === 'br';
				}
				
				if(nxt_is_br)
				{
					i++;
					html += '</p>\n<p>\n';
				}
				else if(ctx.have_text)
					html += '</p>\n<p>\n';
				
				ctx.have_text = false;
			}
			else if(c.name === 'span')
			{
				var e = $(c);
				var s = e.attr('style');
				
				if(s === 'font-style: italic')
					html += '<em>' + to_html($, e, ctx) + '</em>';
				else if(s === 'font-weight: bold')
					html += '<strong>' + to_html($, e, ctx) + '</strong>';
			}
		}
		else if(c.type === 'text')
		{
			var txt = c.data.replace(/[\t]/g, '')
	                        .replace(/[\n]/g, ' ')
	                        .replace(/  +/g, ' ')
	                        .replace(/[….][….][….]+/g, '...')
	                        .replace(/\"\"/g, '"')
	                        .replace(/\[\/?i\]/g, '');
			
			html += txt;
			ctx.have_text = txt.length > 0;
		}
	}
	
	return html;
}

function apply(params, next)
{
    var $ = params.chap.dom;
    var partidx = params.chap['sw-part-index'] + 1;
	var table = $($('#pagecontent > table')[partidx]);
	var trs = table.children();
	var c_row = $(trs[trs.length > 4 ? 2 : 1]);
	var content = $($($(c_row.children()[1]).find('td')[0]).find('div')[0]);
	
	$($.root().contents()).remove();
	
	var html = '<p>\n';
	var ctx =
	{
		have_text: false
	};
	
	html += to_html($, content, ctx);
	html += '</p>\n';
	
	$.root().append($.parseHTML(html));
	
	params.chap.id += '-p' + partidx;
	next();
}

module.exports =
{
    apply: apply
};
