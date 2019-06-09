const ForbiddenError = require('../../../errors/forbiddenError');

const schema = `
  authMe: UserWithRoles!
`;

const resolver = {
  authMe(root, args, context) {
    if (!context.user || !context.user.id) {
      throw new ForbiddenError(context.language);
    }

    return context.user;
  },
};

exports.schema = schema;
exports.resolver = resolver;
