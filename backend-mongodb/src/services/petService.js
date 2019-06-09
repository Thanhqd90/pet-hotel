const PetRepository = require('../database/repositories/petRepository');
const AbstractEntityService = require('./shared/abstractEntityService');

module.exports = class PetService extends AbstractEntityService {
  constructor() {
    super(new PetRepository());
  }
};
