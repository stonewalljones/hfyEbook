function apply(params, next)
{
    params.chap.dom('p').last().remove();
    next();
}

module.exports =
{
    apply: apply
};
