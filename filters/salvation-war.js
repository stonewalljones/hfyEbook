function to_html($, el, ctx)
{
	const cont = el.contents();
	let   html = '';
		
	for(let i = 0; i < cont.length; i++)
	{
		const c = cont[i];
		
		if(c.type === 'tag')
		{
			if(c.name === 'br')
			{
				let nxt_is_br = false;
				
				if(i < cont.length - 1)
				{
					const nxt = cont[i + 1];
					
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
				const e = $(c);
				const s = e.attr('style');
				
				if(s === 'font-style: italic')
					html += '<em>' + to_html($, e, ctx) + '</em>';
				else if(s === 'font-weight: bold')
					html += '<strong>' + to_html($, e, ctx) + '</strong>';
			}
		}
		else if(c.type === 'text')
		{
			const txt = c.data.replace(/[\t]/g, '')
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
    const $ = params.chap.dom;
    const partidx = params.chap['sw-part-index'] + 1;
	const table = $($('#pagecontent > table')[partidx]);
	const trs = table.children();
	const c_row = $(trs[trs.length > 4 ? 2 : 1]);
	const content = $($($(c_row.children()[1]).find('td')[0]).find('div')[0]);
	
	$($.root().contents()).remove();
	
	let html = '<p>\n';
	const ctx =
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
