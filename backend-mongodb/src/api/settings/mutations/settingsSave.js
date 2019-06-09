const SettingsService = require('../../../services/settingsService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  settingsSave(settings: SettingsInput!): Boolean
`;

const resolver = {
  settingsSave: async (root, args, context) => {
    new PermissionChecker(context.language)
      .withRoles(context.roles)
      .validateHas(permissions.settingsEdit);

    await SettingsService.save(args.settings, context.user);

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
