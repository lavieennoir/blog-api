import dotenv from 'dotenv';
import path from 'path';

// First try to load from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Then load from .env.test (will override any values from .env)
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });
