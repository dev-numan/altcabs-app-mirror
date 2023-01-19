import GenericService from './GenericService';

class ChatService extends GenericService {
  getFrontChat = () => this.post(`/mobileapp/chat/front-messages`);
  getBookingChat = bookingId =>
    this.post(`/mobileapp/chat/booking-messages/${bookingId}`);
  sendMessage = (chatId, data) =>
    this.post(`/mobileapp/chat/add-message/${chatId}`, data);
}
const chatService = new ChatService();
export default chatService;
