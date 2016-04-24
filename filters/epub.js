var uuid = require('node-uuid');
var zip = require('node-zip');
var fs = require('fs');

// NOTES:
// FBReader does not support text strikethrough (tags: s, del, strike)

function createContents(spec, uuid)
{
    var xml = [
        '<?xml version="1.0"?>',
        '<package version="2.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId">',
        '  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">',
        '    <dc:title>' + spec.title + '</dc:title>',
        '    <dc:language>en</dc:language>',
        '    <dc:identifier id="BookId" opf:scheme="UUID">' + uuid + '</dc:identifier>',
        '    <dc:creator opf:file-as="' + spec.creator + '" opf:role="aut">' + spec.creator + '</dc:creator>',
        '  </metadata>\n'
    ].join('\n');

    xml += '  <manifest>\n';
    xml += '    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml" />\n';
    xml += '    <item id="style" href="style.css" media-type="text/css" />\n';
    xml += '    <item id="cover" href="cover.xhtml" media-type="application/xhtml+xml" />\n';

    var itm_xml = '', ref_xml = '';
    
    for(var i = 0; i < spec.contents.length; i++)
    {
        var chap = spec.contents[i];

        itm_xml += '    <item id="' + chap.id + '" href="' + chap.id + '.xhtml" media-type="application/xhtml+xml" />\n';
        ref_xml += '    <itemref idref="' + chap.id + '" />\n';
    }

    xml += itm_xml;
    xml += '  </manifest>\n';
    xml += '  <spine toc="ncx">\n';
    xml += '    <itemref idref="cover" />\n';
    xml += ref_xml;

    return xml + '  </spine>\n</package>';
}

function createTOC(spec, uuid)
{
    var xml = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<ncx version="2005-1" xmlns="http://www.daisy.org/z3986/2005/ncx/">',
        '  <head>',
        '    <meta content="' + uuid + '" name="dtb:uid"/>',
        '    <meta content="1" name="dtb:depth"/>',
        '    <meta content="0" name="dtb:totalPageCount"/>',
        '    <meta content="0" name="dtb:maxPageNumber"/>',
        '  </head>',
        '  <docTitle>',
        '    <text>' + spec.title + '</text>',
        '  </docTitle>',
        '  <navMap>\n'].join('\n');

    var add_np = function(id, title, ord)
    {
        xml += [
            '    <navPoint id="' + id + '" playOrder="' + ord + '">',
            '      <navLabel>',
            '        <text>' + title + '</text>',
            '      </navLabel>',
            '      <content src="' + id + '"/>',
            '    </navPoint>\n'
        ].join('\n');
    };

    add_np('cover.xhtml', 'Cover', 0);

    for(var i = 0; i < spec.contents.length; i++)
    {
        var chap = spec.contents[i];

        add_np(chap.id + '.xhtml', chap.title, i + 1);
    }

    return xml + '  </navMap>\n</ncx>';
}

function createXHTML(params, chap)
{
    var xml = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
        '<html xmlns="http://www.w3.org/1999/xhtml">',
        '  <head>',
        '    <meta content="application/xhtml+xml; charset=utf-8" http-equiv="Content-Type"/>',
        '    <link href="style.css" rel="stylesheet" type="text/css"/>',
        '  </head>',
        '  <body>',
        '    <h1>' + chap.title + '</h1>',
        '    ' + (chap.byline ? '<p class="byline">By ' + chap.byline + '</p>' : '<p><br/></p><p><br/></p>'),
        '    <div class="chapter">\n'
    ].join('\n');

    xml += params.unescape_html(chap.dom.xml());
    xml += [
        '    </div>',
        '  </body>',
        '</html>'
    ].join('\n');

    return xml;
}

function createTitle(title)
{
	var html = '';
	var lines = title.split('\n');
	
	for(var i = 0; i < lines.length; i++)
		html += '        <p class="center"><center><div class="title">' + lines[i] + '</div></center></p>\n';

	return html;
}

function createCover(params)
{
	var spec = params.spec;
	var html = [
		'<?xml version="1.0" encoding="utf-8"?>',
		'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
		'<html xmlns="http://www.w3.org/1999/xhtml">',
		'    <head>',
		'        <meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />',
		'        <link rel="stylesheet" type="text/css" href="style.css" />',
		'        <style type="text/css">',
					'.title { font-size: 2.5em; line-height: 1em; font-weight: bold; margin: 0; }\n',
					'.author { font-size: 1.2em; line-height: 1em; font-weight: bold; margin: 0; }\n',
					'.patreon { font-size: 1.2em; line-height: 1em; margin: 0; }\n',
		'        </style>',
		'    </head>',
		'    <body>',
		createTitle(spec.title),
		'        <p class="center"><center><div class="author">By ' + spec.creator + '</div></center></p>',
	].join('\n');

	if(spec.patreon)
		html += '        <p class="center"><center><div class="patreon">Donate securely to the author at <a href="' + spec.patreon + '">patreon.com</a></div></center></p>\n';
	
	return html + '    </body>\n</html>';
}

function apply(params, next)
{
    var spec = params.spec;
    var uid = uuid.v4();
    var zip = require('node-zip')();
    var oname = 'output/' + spec.filename + '.epub';

    console.log('Building ' + oname);

    zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
    zip.folder('META-INF');
    zip.folder('OEBPS');
    zip.file('META-INF/container.xml', '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>', { compression: 'DEFLATE' });
    zip.file('OEBPS/toc.ncx', createTOC(spec, uid), { compression: 'DEFLATE' });
    zip.file('OEBPS/content.opf', createContents(spec, uid), { compression: 'DEFLATE' });
    zip.file('OEBPS/style.css', fs.readFileSync('templates/style.css', 'utf-8'), { compression: 'DEFLATE' });
    zip.file('OEBPS/cover.xhtml', createCover(params), { compression: 'DEFLATE' });

    for(var ci = 0; ci < spec.contents.length; ci++)
    {
        var chap = spec.contents[ci];

        zip.file('OEBPS/' + chap.id + '.xhtml', createXHTML(params, chap), { compression: 'DEFLATE' });
    }

    fs.writeFileSync(oname, zip.generate({ base64: false }), 'binary');
    next();
}

module.exports =
{
    apply: apply
};
