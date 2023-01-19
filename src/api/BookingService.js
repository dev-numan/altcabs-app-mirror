import GenericService from './GenericService';

class BookingService extends GenericService {
  getById = bookingId =>
    this.post(`/mobileapp/booking_process_mobile/${bookingId}/get`);
  cancelBooking = bookingId =>
    this.post(`/mobileapp/booking_process_mobile/cancel-booking/${bookingId}`);
  getQuotationsById = (bookingId, filter) => {
    // console.log(filter);
    return this.post(
      `/mobileapp/booking_process_mobile/${bookingId}/get-booking-quotations`,
      filter,
    );
  };
  bookNormal = (bookingId, index) =>
    this.post(`/mobileapp/booking_process_mobile/${bookingId}/book-normal`, {
      index,
    });
  addDetails = (bookingId, data) => {
    console.log(data);
    return this.post(
      `/mobileapp/booking_process_mobile/${bookingId}/details`,
      data,
    );
  };
  payWithCash = bookingId =>
    this.post(`/mobileapp/booking_process_mobile/${bookingId}/paywithcash`);
  completedBookings = () => this.post(`/mobileapp/myaccount/history`);
  confirmedBookings = () =>
    this.post(`/mobileapp/myaccount/confirmed_bookings`);

  postNewBooking = (data, booking_type = 'normal1') =>
    this.post(
      '/mobileapp/booking_process_mobile/get-quotations/' + booking_type,
      data,
    );
}
const bookingService = new BookingService();
export default bookingService;
