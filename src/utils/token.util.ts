
import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

interface TokenPayload {
    id: string;
    email: string;
    role: string;
}

/**
 * Generate JWT token
 * @param payload - User data to encode in token
 * @param expiresIn - Token expiration time in seconds (default: 7 days)
 * @returns JWT token string
 */
export const generateToken = (payload: TokenPayload, expiresIn: number = 7 * 24 * 60 * 60): string => {
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Verify and decode JWT token
 * @param token - JWT token string
 * @returns Decoded token payload
 * @throws Error if token is invalid
 */
export const verifyToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};
