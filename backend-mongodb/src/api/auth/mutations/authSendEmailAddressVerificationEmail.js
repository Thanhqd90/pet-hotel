const AuthService = require('../../../auth/authService');
const ForbiddenError = require('../../../errors/forbiddenError');

const schema = `
  authSendEmailAddressVerificationEmail: Boolean
`;

const resolver = {
  authSendEmailAddressVerificationEmail: async (
    root,
    args,
    context,
  ) => {
    if (!context.user) {
      throw new ForbiddenError(context.language);
    }

    await AuthService.sendEmailAddressVerificationEmail(
      context.language,
      context.user.email,
    );

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
