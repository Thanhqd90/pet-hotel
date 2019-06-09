const BookingService = require('../../../services/bookingService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  bookingImport(data: BookingInput!, importHash: String!): Boolean
`;

const resolver = {
  bookingImport: async (root, args, context) => {
    new PermissionChecker(context.language)
      .withRoles(context.roles)
      .validateHas(permissions.bookingImport);

    await new BookingService().import(
      args.data,
      args.importHash,
      context.user,
      context.language,
    );

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
