About
-----

Ebook.JS is a flexible E-book processing pipeline. It can automatically compile 
local or online material in HTML or MarkDown to any or all of:

    * EPUB, which is convenient for people consuming the material using small form-factor
      devices like smartphones, dedicated ebook readers or smaller tablets.
    
    * HTML for online self-publishing, embedding and interchange.
    
    * LaTeX for creation of high-quality PDF output with LuaLaTex or XeLaTeX.


Installation
------------

Run 'npm install' to install the dependencies, and you should be good to go.


Usage
-----
node ebook.js 'spec.json'


Feel free to enjoy the resulting output files for personal consumption and to share any
book specifications or filters you author with other users of this tool, but:

PLEASE DO NOT DISTRIBUTE THE RESULTING OUTPUT FILES UNLESS YOU ARE THE AUTHOR OR OWNER
OF THE RIGHTS TO ALL MATERIAL THEY CONTAIN, I.E. DON'T BE A... BAD PERSON.


Licence:
--------

MIT


Bugs and Suggestions
--------------------

Send a PM with the details to https://www.reddit.com/user/b3iAAoLZOH9Y265cujFh/

I'm only around infrequently. If you do not receive an immediate response, it's not because
you're being ignored. I'll be getting back to you as soon as I see your message.


Configuration
-------------

All input files are expected to be encoded as UTF-8. Similarly, intermediary and output
data is also encoded as UTF-8.

This script will generate one or more ebooks when given a simple JSON specification 
file (henceforth referred to as 'specs' for brewity). They have the following format:

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
        
        Source filters that fetch online resources cache the downloaded data in the
        'cache' directory. Clear the 'cache' directory to redownload the source material.
        
        Local files are not cached.
    
		* "from-local-html"
		    Read the chapter data from a local (X)HTML file, given a filename relative
		    to the root directory.

		* "from-local-markdown"
		    Read the chapter data from a local Markdown file, given a filename relative
		    to the root directory.

		* "from-hfy-archive"
		    Downloads and caches the chapter contents from a HFY Archive post given
		    a source URL.
	
		* "from-reddit-post"
		    Downloads and caches the chapter contents from a Reddit post given a source
		    URL. Since Reddits JSON API is used - so that post tagged NSFW can be
		    automatically retrieved - URL-shorteners (like http://redd.it) are not
		    supported. To use such resources, first resolve the actual Reddit link
		    by visiting the URL in a browser.

		    Submission continuations in comments are automatically detected and
		    concatenated with the main submission text before further processing.
		
		* "from-url"
			Downloads and caches the full response from an arbitrary URL. It is the
			responsibility of the user to insert additional filters in the processing
			chain that extracts the content, and presents it as a DOM that is useable
			with subsequent filters, if desired.

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
		    has been determined empirically and works for most of the content in the
		    test corpus.
		    The default maximum preable length can be changed with the parameter
		    "no-preamble-threshold", which can be specified for either the spec, one or
		    more chapters, or both. If both are specified, the chapter parameter takes
		    precedence (used by BatS).

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

		* Series-specific filters for the following:

		    * All Sapiens Go To Heaven
		    * Billy-Bob Space Trucker
		    * Blessed Are The Simple
		    * Builders In The Void: Peace / War
		    * Chrysalis
		    * Client Stone: Freedom / Rebellion
		    * Corridors
		    * Deathworld Origins
		    * Good Training
		    * Guttersnipe
		    * Henosis
		    * HFY Anthology
		    * Humans Don't Make Good Pets
		    * Memories of Creature 88
		    * MIA
		    * Pact
		    * QED
		    * Salvage
		    * The Deathworlders
		    * The Fourth Wave
		    * The Lost Minstrel
		    * The Salvation War: Amageddon / Pantheocide
		    * The Xiu Chang Saga
		    * Worm

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
            processing with lualatex, but xelatex can be used.
            
        * html:
            Emits a HTML file in the root directory with the name [title].html. The
            generated file has no external dependencies and can be uploaded or viewed
            as-is.

"content" (array of objects):
    Each element of the array is an object describing a chapter. Each can contain the
    following fields:

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
	
	NOTE: It is possible to add aditional user-defined parameters to each chapter,
	      which can be used to influence the operation of filters in the relevant
	      processing chain. This has many potential uses, notably to sub-select
	      chapter content in situations where content for multiple chapters
	      originates from the same source URL. For an example of this, see the
	      spec and content filter implementation for The Salvation War.

When a specification contains multiple chapters that use the same source URL, the execution
of all but the first chapter using a given source will block automatically until processing
of the first instance completes. This prevents redundant fetching of that URL when the content
has not yet been cached. Chapters using different source URLs still process in parallel.


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
calls its supplied "next()" function. Consequently, the following is valid:

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
 
    
DOM structure
-------------

Almost all intermediary filters and all output filters expects a constrained DOM layout. It is
the responsibility of any input filter (or a specialised intermediary filter) to harmonise any
input data to conform to the following convention:

The DOM operated on by filters is a HTML fragment, not a full document. It should consist of
nothing but a series of paragraphs, possibly interdispersed by one or more horizontal rules.

Text in each paragraph can be bolded by using nested <strong> tags and italisized by using
<em>. Fixed width blocks can be included by using either <pre> or <code>. Ordered and unordered
lists are supported via <ol> and <ul> respectively, linebreaks can be introduced with <br> but
are strongly discouraged. Empty lines are NOT supported. Struck out text can use either <s>,
<del> or <strike> and text can be centered with the <center> tag,

The only tag permitted outside an enclosing root-level paragraph are horizontal rules which
will be converted to a section break appropriate for each type of output file. Paragraphs should
never be nested.

All styling information, scripts, comments and meta-data should be stripped. Unsupported tags
should be converted to the closest supported tag or discarded.

To wit:

<DOM>
    <p>The first paragraph of the text.</p>
    <p>This paragraph will be followed by additional spacing and an asterism:</p>
    <hr/>
    <p>
        <pre>
            DISCLAIMER: This is not a exhaustive example.
        </pre>
        You're free to use <strong>bold</strong> or <em>italic</em> text. On the
        other hand, you <strike>can</strike> cannot use:
        <ul>
            <li>Headings</li>
            <li>Font tags or any other styling markup or attributes</li>
            <li>HTML entities and character references. Both should be converted to their
                utf-8 encoded equivalents.
            </li>
        </ul>
        While this may seem restrictive, it has proved sufficient to faithfully represent
        the current test corpus, while keeping all filters interoperable and the implementational
        complexity relatively low. It also helps to ensure that the same material is visually
        close to identical across all supported output formats.
    </p>
</DOM>
