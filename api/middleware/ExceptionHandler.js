export default (error, req, res) => {
    res.status(error.statusCode).json(error.toJSON());
}
