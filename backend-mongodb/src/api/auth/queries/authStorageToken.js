const ForbiddenError = require('../../../errors/forbiddenError');
const StorageTokenGenerator = require('../../../storage/storageTokenGenerator');

const schema = `
  authStorageToken: String!
`;

const resolver = {
  authStorageToken(root, args, context) {
    if (!context.user || !context.user.id) {
      throw new ForbiddenError(context.language);
    }

    return new StorageTokenGenerator(
      context.language,
      context.user,
      context.roles,
    ).generateStorageToken();
  },
};

exports.schema = schema;
exports.resolver = resolver;
