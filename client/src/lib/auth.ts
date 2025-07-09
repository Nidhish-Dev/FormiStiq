import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  exp: number;
}

export function verifyToken(token: string): Promise<DecodedToken> {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const now = Date.now() / 1000;

    if (decoded.exp < now) {
      return Promise.reject(new Error('Token expired'));
    }

    return Promise.resolve(decoded);
  } catch (err) {
    return Promise.reject(new Error('Invalid token'));
  }
}
