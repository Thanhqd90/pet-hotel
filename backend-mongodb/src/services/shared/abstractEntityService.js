const ValidationError = require('../../errors/validationError');
const AbstractRepository = require('../../database/repositories/abstractRepository');

module.exports = class AbstractEntityService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(data, currentUser) {
    const session = await AbstractRepository.createSession();

    try {
      const record = await this.repository.create(data, {
        session: session,
        currentUser,
      });

      await AbstractRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await AbstractRepository.abortTransaction(session);
      throw error;
    }
  }

  async update(id, data, currentUser) {
    const session = await AbstractRepository.createSession();

    try {
      const record = await this.repository.update(
        id,
        data,
        {
          session,
          currentUser,
        },
      );

      await AbstractRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await AbstractRepository.abortTransaction(session);
      throw error;
    }
  }

  async destroyAll(ids, currentUser) {
    const session = await AbstractRepository.createSession();

    try {
      for (const id of ids) {
        await this.repository.destroy(id, {
          session,
          currentUser,
        });
      }

      await AbstractRepository.commitTransaction(session);
    } catch (error) {
      await AbstractRepository.abortTransaction(session);
      throw error;
    }
  }

  async import(data, importHash, currentUser, language) {
    if (!importHash) {
      throw new ValidationError(
        language,
        'importer.errors.importHashRequired',
      );
    }

    if (await this._isImportHashExistent(importHash)) {
      throw new ValidationError(
        language,
        'importer.errors.importHashExistent',
      );
    }

    const dataToCreate = {
      ...data,
      importHash,
    };

    return this.create(dataToCreate, currentUser);
  }

  async _isImportHashExistent(importHash) {
    const count = await this.repository.count({
      importHash,
    });

    return count > 0;
  }
};
