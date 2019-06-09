const PetRepository = require('../../../database/repositories/petRepository');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  petFind(id: String!): Pet!
`;

const resolver = {
  petFind: async (root, args, context) => {
    new PermissionChecker(context.language)
      .withRoles(context.roles)
      .validateHas(permissions.petRead);

    return new PetRepository().findById(args.id);
  },
};

exports.schema = schema;
exports.resolver = resolver;
