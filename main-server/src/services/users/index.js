class UsersService{
    async getAll() {
        return await (await fetch(`${process.env.DB_SERVER_URL}/users`)).json();
    }
}

module.exports = new UsersService();