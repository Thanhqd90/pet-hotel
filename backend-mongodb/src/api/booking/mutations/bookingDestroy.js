const BookingService = require('../../../services/bookingService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  bookingDestroy(ids: [String!]!): Boolean
`;

const resolver = {
  bookingDestroy: async (root, args, context) => {
    new PermissionChecker(context.language)
      .withRoles(context.roles)
      .validateHas(permissions.bookingDestroy);

    await new BookingService().destroyAll(
      args.ids,
      context.user,
    );

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
