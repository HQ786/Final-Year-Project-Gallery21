import jwt from 'jsonwebtoken';

const checkTokenExpiration = () => {
    const token = localStorage.getItem('userToken');
    if (token) {
      const decodedToken = jwt.decode(token)
      const expirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds
      const currentTime = Date.now();
      if (currentTime >= expirationTime) {
        // remove expired token from localStorage
        localStorage.removeItem('userToken');
        }
    }
  };
export default checkTokenExpiration;