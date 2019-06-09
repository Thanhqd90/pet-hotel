const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;
const BookingRepository = require('../../../database/repositories/bookingRepository');

const schema = `
  bookingAutocomplete(query: String, limit: Int): [AutocompleteOption!]!
`;

const resolver = {
  bookingAutocomplete: async (root, args, context, info) => {
    new PermissionChecker(context.language)
      .withRoles(context.roles)
      .validateHas(permissions.bookingAutocomplete);

    return new BookingRepository().findAllAutocomplete(
      args.query,
      args.limit,
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
