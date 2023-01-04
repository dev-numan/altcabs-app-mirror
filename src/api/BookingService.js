import GenericService from './GenericService';

class BookingService extends GenericService {
  constructor() {
    super('google');
  }
  getById = bookingId =>
    this.post(`/mobileapp/booking_process_mobile/${bookingId}/get`);
  getQuotationsById = (bookingId, filter) => {
    // console.log(filter);
    return this.post(
      `/mobileapp/booking_process_mobile/${bookingId}/get-quotations`,
      filter,
    );
  };
}
const bookingService = new BookingService();
export default bookingService;
