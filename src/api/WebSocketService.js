import {w3cwebsocket as W3CWebSocket} from 'websocket';
import {SOCKET_URL} from '../config';
import {EventEmitter} from '../utils/Utils';

const path = SOCKET_URL;
console.log('Web Socket Path: ' + path);
const client = new W3CWebSocket(path);
class WebSocketService extends EventEmitter {
  constructor() {
    super();
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = message => {
      let jsonMessage = JSON.parse(message.data);
      // console.log('jsonMessage');
      // console.log(jsonMessage);
      switch (jsonMessage.type) {
        case 'booking-payment-updated':
          this.emit('booking-payment-updated', {
            bookingId: jsonMessage.bookingId,
            payments: jsonMessage.payments,
          });
          break;
        case 'booking-updated':
          this.emit('booking-updated', {
            bookingId: jsonMessage.bookingId,
            companyId: jsonMessage.companyId,
            status: jsonMessage.status,
            reference: jsonMessage.reference,
            comments: jsonMessage.comments,
          });
          break;
        case 'new_message_for_admin':
          this.emit('new_message_for_admin', jsonMessage.message);

          break;
        case 'message_received':
          this.emit(
            'message_received',
            jsonMessage.chatId,
            jsonMessage.message,
          );

          break;
        case 'new_request':
          this.emit('new_request');

          break;
        case 'new_bin':
          this.emit('new_bin');

          break;
        case 'booking_activity':
          this.emit('booking_activity');

          break;
        case 'request_lapsed':
          this.emit('request_lapsed');
        case 'ride_accepted':
          this.emit('ride_accepted');
        case 'ride_assigned_client_bidding':
          this.emit('ride_assigned_client_bidding');
        case 'ride_assigned_cabmatch':
          this.emit('ride_assigned_cabmatch');
        case 'chat-modified':
          this.emit('chat-modified');
        case 'quotes-added-to-booking':
          this.emit(
            'quotes-added-to-booking',
            jsonMessage.booking_id,
            jsonMessage.quotations,
          );
        default:
          break;
      }
      //   client.send(JSON.stringify({ token: response.data.access_token }));
    };
  }
  setChatId = chatId => {
    let data = {type: 'set_chat_id', chatId};
    this.send(data);
  };
  setBookingId = booking_id => {
    let data = {type: 'set_booking_id', booking_id};
    this.send(data);
  };
  setCompanyID = companyId => {
    let data = {type: 'setcompany', companyId};
    this.send(data);
  };
  authenticate = token => {
    let data = {type: 'authenticate', token};
    this.send(data);
  };
  authenticateSuperAdmin = (token, company_id) => {
    let data = {type: 'authenticate', token, company_id};
    this.send(data);
  };
  send = (message, callback) => {
    let JSONMEssage = JSON.stringify(message);
    this.waitForConnection(function () {
      client.send(JSONMEssage);
      if (typeof callback !== 'undefined') {
        callback();
      }
    }, 1000);
  };

  waitForConnection = (callback, interval) => {
    if (client.readyState === 1) {
      callback();
    } else {
      var that = this;
      // optional: implement backoff for interval here
      setTimeout(function () {
        that.waitForConnection(callback, interval);
      }, interval);
    }
  };
  refreshNewRequests() {
    this.emit('new_request');
  }
}

let webSocketService = new WebSocketService();
Object.freeze(webSocketService);
export default webSocketService;
