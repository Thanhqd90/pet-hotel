const BookingRepository = require('../../../database/repositories/bookingRepository');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  bookingFind(id: String!): Booking!
`;

const resolver = {
  bookingFind: async (root, args, context) => {
    new PermissionChecker(context.language)
      .withRoles(context.roles)
      .validateHas(permissions.bookingRead);

    return new BookingRepository().findById(args.id);
  },
};

exports.schema = schema;
exports.resolver = resolver;
