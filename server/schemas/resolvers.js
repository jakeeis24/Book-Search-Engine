const { Book, User } = require("../models");

const resolvers = {
  Query: {
    User: async () => {
      return User.find({});
    },
  },

  Mutation: {},
};
module.exports = resolvers;
