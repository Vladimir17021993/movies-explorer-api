class ErrorWrongUser extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.name = 'WrongUser';
  }
}

module.exports = ErrorWrongUser;
