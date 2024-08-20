const validate = (Schema) => async (req, res, next) => {
    try {
        const parsedBody = await Schema.parseAsync(req.body);
        req.body = parsedBody
        next();
    } catch (err) {
        const details = err.errors[0].message;
        console.log(details);
        const message = 'Invalid details';
        const status = 400;
        const error = {
            status,
            message,
            details
        }
        next(error);


    }
}
export default validate;