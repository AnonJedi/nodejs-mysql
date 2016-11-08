describe('testing books query', () => {
    const User = require('./user');

    it('should return an array of books', () => {
        User.fetchAll()
            .then(users => {
                expect(users).toBeInstanceOf(Array);
            });
    });
});
