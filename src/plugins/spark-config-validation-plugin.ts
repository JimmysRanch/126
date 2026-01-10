import type { Plugin } from 'vite';

/**
 * Vite plugin to validate GitHub Spark configuration and provide better error messages
 */
export function sparkConfigValidationPlugin(): Plugin {
  return {
    name: 'spark-config-validation',
    configResolved(config) {
      // Check for required environment variables
      const githubToken = process.env.GITHUB_TOKEN;
      const isProduction = config.mode === 'production';
      
      if (!githubToken && !isProduction) {
        console.warn('\n⚠️  WARNING: GITHUB_TOKEN environment variable is not set!');
        console.warn('   GitHub Spark AI features will not work without it.');
        console.warn('   To fix this:');
        console.warn('   1. Create a GitHub Personal Access Token at https://github.com/settings/tokens');
        console.warn('   2. Set it as an environment variable: export GITHUB_TOKEN=your_token_here');
        console.warn('   3. Restart the development server\n');
      }
    },
    configureServer(server) {
      // Intercept the /_spark/llm proxy to provide better error messages
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/_spark/llm')) {
          const githubToken = process.env.GITHUB_TOKEN;
          
          if (!githubToken) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              error: {
                message: 'Missing GITHUB_TOKEN environment variable',
                details: 'GitHub Spark requires a GITHUB_TOKEN to authenticate with GitHub Models API. Please set the GITHUB_TOKEN environment variable and restart the server.',
                instructions: [
                  'Create a GitHub Personal Access Token at https://github.com/settings/tokens',
                  'Set the token as an environment variable: export GITHUB_TOKEN=your_token_here',
                  'Restart the development server'
                ]
              }
            }));
            return;
          }
        }
        next();
      });
    }
  };
}
