Installation
------------
Run 'npm install' to install the dependencies, and you should be good to go.


Usage
-----
node ebook.js <spec.json>

PLEASE DO NOT DISTRIBUTE THE RESULTING OUTPUT FILES UNLESS YOU ARE THE AUTHOR OF OR OWNS
THE RIGHTS TO ALL MATERIAL THEY CONTAIN.


Licence:
--------
MIT


Bugs and Suggestions
--------------------
PM either to https://www.reddit.com/user/b3iAAoLZOH9Y265cujFh/

I'm only around infrequently. If you do not receive an immediate response, it's not because
you're being ignored. I'll be getting back to you at the earliest available opportunity.


Configuration
-------------
All input files are expected to be encoded as UTF-8. Similarly, intermediary and output
data is also encoded as UTF-8.

This script will generate one or more ebooks when given a simple JSON file. These
files will be referred to as 'specs', and have the following format:

"title" (string):
    Used as the book title and as the basis for the output filename.

"creator" (string):
    The name of the author. Embedded into output meta-data and used for by-lines.

"filters" (array of strings OR object of named filter arrays):
    Names of filters to be appled to each chapter sequentially, or a set of named
    filter name arrays. When the latter option is used, each chapter must include
    a "filter" reference. The name of a filter is equivalent to its filename, sans
    extension. While filters are executed sequentially, chapters are processes in parallel.
    Each filter chain should begin with an input filter that obtains the
    material for each chapter and makes it available for further processing by subsequent
    filters. Source filters  have names beginning with 'from-' by convention.

    The following filters are included:

    SOURCES:
    
		* "from-local-html"
		    Read the chapter data from a local (X)HTML file, given a filename relative
		    to the root directory.

		* "from-local-markdown"
		    Read the chapter data from a local Markdown file, given a filename relative
		    to the root directory.

		* "from-reddit-post"
		    Downloads and caches the chapter contents from a Reddit post given a source
		    URL. Since Reddits JSON API is used - so that post tagged NSFW can be
		    automatically retrieved - URL-shorteners (like http://redd.it) are not
		    supported. To use such resources, first resolve the actual Reddit link
		    by visiting the URL in a browser.

		    Submission continuations in comments are automatically detected and
		    concatenated with the main submission text before further processing.

		* "from-hfy-archive"
		    Downloads and caches the chapter contents from a HFY Archive post given
		    a source URL.
	
	FILTERS:
		* "clean-reddit"
		    Removes HTML comment elements, CSS classes on any other element and
		    replaces any HTTP/HTTPS link to reddit with its text. Links to other
		    domains are retained.

		* "custom-break-to-hr"
		    Different series use a variety of ways to indicate breaks / segments or pauses
		    in the text. This filter harmonizes all known instances of this into <hr />
		    elements, which can then be further processed by the typography
		    filter (see below)

		* "finalize"
			Removal of DOM elements by other filters tends to leave surrounding text
			blocks containing newlines. This can lead to undesirable formatting in
			output formats where whitespace is not completely ignored (latex). This filter
			removes such blocks if and only if they're redundant (i.e. more than one
			such block occurs in a row). It also removes any completely empty paragraphs.
			
		* "no-preamble"
		    Removes any post content preceding the first horizontal rule, if the total
		    length of the content does not exceed 2500 characters. The threshold value
		    has been determined empirically and is known to correctly filter author
		    preambles from all chapters in the current corpus with no false positives.

		* "print-dom"
			Makes no changes, but displays a visual representation of the DOM at the
			point in the filtering chain in which it's inserted. Very handy for
			tracking down when and why undesirable DOM transformations are performed.
			
		* "typography"
		    Replaces opening and closing quotes and apostrophes with right / left versions,
		    replaces '...' with proper ellipsis, removes redundant, leading or trailing
		    horizontal rules and replaces the ones remaining with asterisms. Note that
		    unicode characters are used rather than HTML entities, since practically
		    all EPUB readers have problems rendering these correctly. Conversely,
		    not using entites can be correctly handled by all modern browsers.

		* Series-specific filters for the following (not all series in the current corpus
		  requires additional or custom filtering):

		    * Billy-Bob Space Trucker
		    * Blessed Are The Simple
		    * Builders In The Void: Peace / War
		    * Client Stone: Freedom / Rebellion
		    * Humans Don't Make Good Pets
		    * MIA
		    * Perspective
		    * QED
		    * Salvage
		    * The Deathworlders
		    * The Xiu Chang Saga

"filename" (string):
	Specifies the base name for emitted output files. Omits extension, since that
	is appended by each output plugin (see below) as appropriate.
	
"output" (string or array of strings):
    Used to specify one or more integrations filters that build output files based
    on the filtered chapter contents. If only a single type of output is desired,
    a single filter can be specified, i.e. "epub". Multiple output files can
    be generated by specifying a filter chain, i.e. ["epub", "html"]. Output filters
    are processed in order, just like per-chapter filter chains. The following
    output filters are included:

        * epub:
            Emits an EPUB file in the root directory with the name [title].epub

        * latex:
            Emits a TEX file with the name [title].tex. The format is optimized for
            processing with xelatex, but pdflatex can be used. If a Patreon link is
            included in the cover XHTML file, it is automatically extracted and added
            to the cover page and thus also included in generated PDFs.
            
        * html:
            Emits a HTML file in the root directory with the name [title].html. The
            generated file has no external dependencies and can be uploaded or viewed
            as-is.

"content" (array of objects):
    Each element of the array is an object describing a chapter. Each of these
    instances contains the following fields:

        * "title" (string):
            The chapter title. Used to generate headings and when building TOCs.

        * "byline" (string, optional):
            If specified, this will add an author byline to this chapter. This can
            be used to support collected content by various authors with full
            per-chapter attribution.

        * "src" (string):
            The source location of the material for the given chapter. This can
            be any value appropriate to the chosen input filter (see above).

		* "filter" (string, optional):
			If a set of filter chains have been specified, this reference to a chain
			by name is mandatory. This feature can be used to support multi-source
			or variably filtered content.


Authoring Filters
-----------------
Each filter is implemented as a Node.JS module, and placed in the "filters"
directory. Each filter module must export exactly one function:

    function apply(params, next);

    * "params" (object)
        Represents the current task to be performed by the filter. Has two members:

        * "spec" (object)
            Represents the loaded specification file and contains members data as
            described above.

        * "chap" (object)
            A reference to the spec.contents elements this filter is to process (if
            used as a chapter filter), or null (if used as an output filter).

            In addition to the fields from above, it will be decorated by the
            following members:

            * "dom" (object)
                A Cheerio DOM object. For more information on how to work with
                Cheerio, refer to the documentation at:

                https://github.com/cheeriojs/cheerio

    * "next" (function())
        A function that must be called by the filter when it completes and any
        modifications to "params.chap.dom" have been completed.

Thus, a minimal valid filter implementation is:

    function apply(params, next)
    {
        next();
    }

    module.exports =
    {
        apply: apply
    };

Any subsequent filter will not be applied until the preceding filter
calls its supplied "next" function. Consequently, the following is valid:

    function apply(params, next)
    {
        setTimeout(next, 1000);
    }

If the filter is written to be used as an input - the first filter in a chain -
its name should begin with 'from-', and it has two additional responsibilities:

    function apply(params, next)
    {
        var chap = params.chap;

        // Create the HTML DOM subsequent filters will operate on:
        chap.dom = cheerio.load('');

        // Create a unique (per book) id. This will be used both
        // as an XML/HTML element identifier and as a chapter filename
        // in the case of EPUB output, and is thus subject to the
        // union of the restriction imposed on all of the above. I suggest
        // ensuring that it contains only alphanumerics, dashes and underscores.
        chap.id = sanitize(chap.src);
    }
 
    
Performance
-----------
Pretty good. On my hardware (i7, 4 cores @ 1.60GHz), the current corpus (5645 pages when
typeset af PDF) can be retrieved from cache, filterred, typeset and emitted to finished epub,
latex and html in 36 seconds. A 2-pass build of pdf files takes an additional 1 minute and
15 seconds using XeTeX, resulting in a total of 40.7Mb of output data in 56 files.

In short, unless you require sustained throughput of more than three average length books
per minute, pretty much any reasonably modern computer will run this just fine.
