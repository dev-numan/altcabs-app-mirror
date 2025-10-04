import axiosInstance from './index.js';

class VoucherService {
  constructor() {
    this.http = axiosInstance;
  }

  async applyVoucher(bookingId, voucherCode) {
    try {
      const response = await this.http.post(
        `/mobileapp/booking_process_mobile/${bookingId}/apply-voucher`,
        { voucherCode }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to apply voucher' };
    }
  }

  async removeVoucher(bookingId) {
    try {
      const response = await this.http.post(
        `/mobileapp/booking_process_mobile/${bookingId}/remove-voucher`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to remove voucher' };
    }
  }
}

export default new VoucherService();
