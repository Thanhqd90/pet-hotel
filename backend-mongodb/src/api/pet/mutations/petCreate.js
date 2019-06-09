const PetService = require('../../../services/petService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  petCreate(data: PetInput!): Pet!
`;

const resolver = {
  petCreate: async (root, args, context) => {
    new PermissionChecker(context.language)
      .withRoles(context.roles)
      .validateHas(permissions.petCreate);

    return new PetService().create(
      args.data,
      context.user,
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
