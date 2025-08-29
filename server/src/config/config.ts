import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Use a type assertion to explicitly tell TypeScript the type.
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in the .env file.");
    process.exit(1); // Stop the application if the secret is missing
}

// Export a configuration object
export const config = {
    jwt: {
        secret: JWT_SECRET,
        expiresIn: JWT_EXPIRES_IN,
    },
};
