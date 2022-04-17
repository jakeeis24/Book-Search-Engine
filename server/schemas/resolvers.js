const { Book, User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.User) {
        return User.findOne({ _id: context.user._id });
      }
      throw Error("You need to be logged in!");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }, context) => {
      const user = await User.create({
        username,
        email,
        password,
      });
      if (!user) {
        throw Error("Something went wrong");
      }
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }, context) => {
      const user = await User.findOne({
        email,
      });
      if (!user) {
        throw Error("No user assocaited with the input.");
      }
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw Error("Incorrect password");
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { book }, context) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: User._id },
          { $addToSet: { savedBooks: book } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        throw Error("Could not save the book");
      }
    },
    removeBook: async (parent, { bookId }, context) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: User._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        throw Error("Could not find a user with this ID");
      }
      return updatedUser;
    },
  },
};
module.exports = resolvers;
