const AuthProfileEditor = require('../../../services/auth/authProfileEditor');
const ForbiddenError = require('../../../errors/forbiddenError');

const schema = `
  authUpdateProfile(profile: UserProfileInput!): Boolean
`;

const resolver = {
  authUpdateProfile: async (root, args, context) => {
    if (!context.user || !context.user.id) {
      throw new ForbiddenError(context.language);
    }

    let editor = new AuthProfileEditor(
      context.user,
      context.language,
    );

    await editor.execute(args.profile);

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
