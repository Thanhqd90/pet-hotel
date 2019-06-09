const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;
const PetRepository = require('../../../database/repositories/petRepository');

const schema = `
  petAutocomplete(query: String, limit: Int): [AutocompleteOption!]!
`;

const resolver = {
  petAutocomplete: async (root, args, context, info) => {
    new PermissionChecker(context.language)
      .withRoles(context.roles)
      .validateHas(permissions.petAutocomplete);

    return new PetRepository().findAllAutocomplete(
      args.query,
      args.limit,
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
