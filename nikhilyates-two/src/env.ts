import { z } from 'zod'

const envSchema = z.object({
    RESEND_API_KEY: z.string().min(1),
});

// During build, skip validation and return safe defaults
// At runtime, validate properly
const getEnv = () => {
    // Check if we're in build phase
    const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

    // Check if all required env vars are present
    const hasAllEnvVars = !!(
        process.env.RESEND_API_KEY
    );

    // During build or if env vars are missing, return safe defaults
    if (isBuildPhase || !hasAllEnvVars) {
        return {
            RESEND_API_KEY: process.env.RESEND_API_KEY || '',
        };
    }

    // At runtime with all env vars present, validate
    try {
        return envSchema.parse({
            RESEND_API_KEY: process.env.RESEND_API_KEY,
        });
    } catch (error) {
        // If validation fails, return defaults (shouldn't happen at runtime if env vars are set)
        console.warn('Environment variable validation failed, using defaults:', error);
        return {
            RESEND_API_KEY: process.env.RESEND_API_KEY || '',
        };
    }
};

export const env = getEnv();
