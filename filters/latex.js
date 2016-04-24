var cheerio = require('cheerio');
var fs = require('fs');

// Noto Serif
// DejaVu Serif
// Linux Libertine
// Linux Biolinum
var typeface = 'Liberation Serif';

function l_esc(txt)
{
	return txt.replace(/%/g, '\\%')
			  .replace(/\$/g, '\\$')
			  .replace(/#/g, '\\#')
			  .replace(/_/g, '\\_')
			  .replace(/\{/g, '\\{')
			  .replace(/\}/g, '\\}')
              .replace(/&/g, '\\&');
}

function filter(p, txt)
{
	return l_esc(p.unescape_html(txt).replace(/&lt;/g, '<')
	                                 .replace(/&gt;/g, '>')
	                                 .replace(/&nbsp;/g, ' ')
	                                 .replace(/&mdash;/g, '---')
	                                 .replace(/&ndash;/g, '-'))
	                                 	 .replace(/\\([^%\$#_\{\}&])/gm, '{\\textbackslash}$1')
	                                 	 .replace(/\\$/g, '{\\textbackslash}')
							             .replace(/~/g, '{\\textasciitilde}')
							             .replace(/\^/g, '{\\textasciicircum}')
                                         .replace(/…/g, '{\\ldots}')
                                         .replace(/\.\.\./g, '{\\ldots}');
}

function tolatex(p, $, e, brk)
{
	var latex = '';
	
	e.contents().each(function(i, el)
	{
		var elem = $(el);
		
		// console.log(id + el.type);
		
		if(el.type === 'text')
			latex += filter(p, el.data);
		else if(el.type === 'tag')
		{
			if(el.name === 'center')
			{
				var sl = tolatex(p, $, elem);
				
				if(sl === '⁂')
					latex += '\\asterism\n';
				else
					latex += '\\begin{center}' + sl + '\\end{center}';
			}
			else if(el.name === 'em')
				latex += '\\textit{' + tolatex(p, $, elem) + '}';
			else if(el.name === 'strong')
				latex += '\\textbf{' + tolatex(p, $, elem) + '}';
			else if(el.name === 'pre' || el.name === 'code')
				latex += '\\texttt{' + tolatex(p, $, elem).replace(/\n/g, '\\\\*') + '}';
			else if(el.name === 'a')
				latex += '\\href{' + l_esc(el.attribs['href']) + '}{' + tolatex(p, $, elem) + '}';
			else if(el.name === 'p')
			{
				var t = tolatex(p, $, elem);
				
				latex += t + (t.indexOf('\\star') > -1 ? '' : '\n');
			}
			else if(el.name === 'span')
				latex += tolatex(p, $, elem);
			else if(el.name === 'li')
				latex += '\\item ' + tolatex(p, $, elem);
			else if(el.name === 'ul')
				latex += '\\begin{itemize}' + tolatex(p, $, elem) + '\n\\end{itemize}';
			else if(el.name === 'ol')
				latex += '\\begin{enumerate}' + tolatex(p, $, elem) + '\n\\end{enumerate}';
			else if(el.name === 'br')
				latex += '\\\\*\n';
			else if(el.name === 's' || el.name === 'del' || el.name === 'strike')
				latex += '\\sout{' + tolatex(p, $, elem) + '}';
			else
			{
				console.log('LaTeX: Unhandled tag: ' + el.name);
				latex += tolatex(p, $, elem);
			}
		}
	});
	
	return latex;
}

function apply(params, next)
{
    var spec = params.spec;
    var oname = 'output/' + spec.filename + '.tex';
    var latex = [
		'\\documentclass[a4paper,10pt]{article}',
		'',
		'\\usepackage{fontspec,xunicode}',
		'\\usepackage{ifxetex}',
		'\\usepackage[normalem]{ulem}',
		'\\usepackage{tocloft}',
		'\\usepackage{stackengine}',
		'\\usepackage[colorlinks = true, linkcolor = blue, urlcolor = blue, pdfborder = {0 0 0}]{hyperref}',
		'',
		'\\ifxetex',
		'  \\usepackage{fontspec}',
		'  \\defaultfontfeatures{Ligatures=TeX}',
		'  \\setromanfont{' + typeface + '}',
		'\\else',
		'  \\usepackage[T1]{fontenc}',
		'  \\usepackage[utf8]{inputenc}',	
		'\\fi',
		'',
		'\\def\\asterism{\\par\\begin{center}\\scalebox{2}{$\\cdots$}\\end{center}}',
		'',
		'\\setlength{\\parskip}{\\baselineskip}',
		'\\setlength{\\parindent}{0pt}',
		'\\linespread{1.2}',
		'\\raggedright',
		'',
		'\\renewcommand{\\cftsecfont}{}',
		'\\renewcommand{\\cftsecpagefont}{}',
		'\\renewcommand{\\cftsecpresnum}{\\begin{lrbox}{\\@tempboxa}}',
		'\\renewcommand{\\cftsecaftersnum}{\\end{lrbox}}',
		'\\renewcommand{\\cftsecleader}{\\cftdotfill{\\cftdotsep}}',
		'\\renewcommand{\\contentsname}{Table of contents\\linebreak}',
		'\\setcounter{secnumdepth}{-2}',
		'',
		'\\begin{document}',
		'',
		'\\title{' + l_esc(spec.title).replace(/\n/g, '\\\\\n') + '}',
		'\\author{' + l_esc(spec.creator) + (spec.patreon ? '\\\\ Donate securely to the author at \\href{' + l_esc(spec.patreon) + '}{Patreon}' : '') + '}',
		'\\date{}',
		'',
		'\\maketitle',
		'\\pagestyle{empty}',
		'\\thispagestyle{empty}',
		'',
		'\\vfill',
		'',
		'\\begin{center}Set in ' + typeface + '\\end{center}',
		'\\clearpage',
		'\\tableofcontents',
		'\\clearpage',
		'\\pagestyle{plain}',
		'\\pagenumbering{arabic}',
		''
	].join('\n');

    console.log('Building ' + oname);

    for(var i = 0; i < spec.contents.length; i++)
    {
        var chap = spec.contents[i];

        latex += '\\clearpage\n\\section{' + l_esc(chap.title) + '}\n';
        
        if(chap.byline)
        	latex += '\\vspace{-2em}By ' + chap.byline + '\\vspace{1em}\n';
        
        latex += tolatex(params, chap.dom, chap.dom.root());
    }

    latex += '\\end{document}'

    fs.writeFileSync(oname, latex, 'utf-8');
    next();
}

module.exports =
{
    apply: apply
};
