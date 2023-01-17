import GenericService from './GenericService';

class AuthService extends GenericService {
  forgetPassword = email => this.post('/mobileApp/auth/forget/' + email);
  resendVerificationEmail = data =>
    this.post('/mobileApp/auth/resendVerificationEmail/' + data);
}
const authService = new AuthService();
export default authService;
