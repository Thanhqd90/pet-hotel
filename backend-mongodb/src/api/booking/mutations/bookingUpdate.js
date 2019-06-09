const BookingService = require('../../../services/bookingService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  bookingUpdate(id: String!, data: BookingInput!): Booking!
`;

const resolver = {
  bookingUpdate: async (root, args, context) => {
    new PermissionChecker(context.language)
      .withRoles(context.roles)
      .validateHas(permissions.bookingEdit);

    return new BookingService().update(
      args.id,
      args.data,
      context.user,
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
