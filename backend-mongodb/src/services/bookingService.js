const BookingRepository = require('../database/repositories/bookingRepository');
const AbstractEntityService = require('./shared/abstractEntityService');

module.exports = class BookingService extends AbstractEntityService {
  constructor() {
    super(new BookingRepository());
  }
};
