function apply(params, next)
{
    const $ = params.chap.dom;
    const break_test = /[^\+\n .]/;

    // Deathworlders, Salvage: <p>[^\+.]</p> -> <hr/>
    $('p').each(function(i, e)
    {
        const el = $(e);
        const txt = el.text();

        if(txt !== '' && !break_test.test(txt))
        {
            e.name = 'hr';
            e.children = [];
        }
    });

    next();
}

module.exports =
{
    apply: apply
};
