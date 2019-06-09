const BookingService = require('../../../services/bookingService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  bookingCreate(data: BookingInput!): Booking!
`;

const resolver = {
  bookingCreate: async (root, args, context) => {
    new PermissionChecker(context.language)
      .withRoles(context.roles)
      .validateHas(permissions.bookingCreate);

    return new BookingService().create(
      args.data,
      context.user,
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
