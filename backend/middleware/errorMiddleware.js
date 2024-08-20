const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500
    const message = err.message || 'Backend Error';
    const details = err.details || 'Backend Error';

    console.log(err)

    return res.status(status).json({ message, details })
};

export default errorMiddleware;