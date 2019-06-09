const PetRepository = require('../../../database/repositories/petRepository');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;
const graphqlSelectRequestedAttributes = require('../../shared/utils/graphqlSelectRequestedAttributes');

const schema = `
  petList(filter: PetFilterInput, limit: Int, offset: Int, orderBy: PetOrderByEnum): PetPage!
`;

const resolver = {
  petList: async (root, args, context, info) => {
    new PermissionChecker(context.language)
      .withRoles(context.roles)
      .validateHas(permissions.petRead);

    return new PetRepository().findAndCountAll({
      ...args,
      requestedAttributes: graphqlSelectRequestedAttributes(
        info,
        'rows',
      ),
    });
  },
};

exports.schema = schema;
exports.resolver = resolver;
