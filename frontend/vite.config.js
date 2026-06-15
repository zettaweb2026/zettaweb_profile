const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react').default;
const path = require('path');

// Express route mock for visual edits and health check endpoints
const expressRoutes = [];
const devServerApp = {
  get(path, handler) {
    expressRoutes.push({ method: 'GET', path, handler });
  },
  post(path, handler) {
    expressRoutes.push({ method: 'POST', path, handler });
  },
  options(path, handler) {
    expressRoutes.push({ method: 'OPTIONS', path, handler });
  },
  use(handler) {
    expressRoutes.push({ method: 'USE', path: '*', handler });
  }
};
const devServerMock = { app: devServerApp };

// Express adapter to run endpoints inside Vite's Connect middleware
const expressAdapter = (handler) => {
  return async (req, res, next) => {
    req.get = (name) => req.headers[name.toLowerCase()];
    
    if (req.method === 'POST' && !req.body) {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const raw = Buffer.concat(buffers).toString();
      try {
        req.body = JSON.parse(raw);
      } catch {
        req.body = {};
      }
    }

    res.header = (name, value) => {
      res.setHeader(name, value);
      return res;
    };
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    };
    res.send = (data) => {
      if (typeof data === 'object') {
        res.json(data);
      } else {
        res.end(data);
      }
    };
    res.sendStatus = (code) => {
      res.statusCode = code;
      res.end();
    };

    try {
      await handler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

// Mount the custom middlewares (Visual Editing dev-server-setup + health-endpoints)
try {
  const setupDevServer = require('./plugins/visual-edits/dev-server-setup');
  setupDevServer({}).setupMiddlewares([], devServerMock);
} catch (e) {
  console.warn('[Vite Setup] Visual edits dev server setup not loaded:', e.message);
}

try {
  const setupHealthEndpoints = require('./plugins/health-check/health-endpoints');
  const MockHealthPlugin = {
    getStatus() {
      return {
        isHealthy: true,
        state: 'success',
        hasCompiled: true,
        errorCount: 0,
        warningCount: 0,
        lastCompileTime: Date.now(),
        lastSuccessTime: Date.now(),
        compileDuration: 50,
        totalCompiles: 1,
        firstCompileTime: Date.now(),
        errors: [],
        warnings: []
      };
    },
    getSimpleStatus() {
      return {
        state: 'success',
        isHealthy: true,
        errorCount: 0,
        warningCount: 0
      };
    }
  };
  setupHealthEndpoints(devServerMock, MockHealthPlugin);
} catch (e) {
  console.warn('[Vite Setup] Health check endpoints not loaded:', e.message);
}

// Vite plugin to dispatch incoming requests to mapped express-like endpoints
const visualAndHealthPlugin = () => {
  return {
    name: 'vite-plugin-visual-edits-and-health',
    configureServer(server) {
      console.log(`[Vite Setup] Configured server with ${expressRoutes.length} mock routes.`);
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const pathName = url.pathname;
        const method = req.method;

        console.log(`[Vite DevServer] Request: ${method} ${pathName}`);

        let routeIndex = 0;
        const runNext = async (err) => {
          if (err) return next(err);
          if (routeIndex >= expressRoutes.length) {
            return next();
          }

          const r = expressRoutes[routeIndex++];
          const isMethodMatch = r.method === method || r.method === 'USE';
          const isPathMatch = r.path === '*' || r.path === pathName;

          if (isMethodMatch && isPathMatch) {
            console.log(`[Vite DevServer] Match: ${r.method} ${r.path}`);
            const adaptedHandler = expressAdapter(r.handler);
            await adaptedHandler(req, res, runNext);
          } else {
            await runNext();
          }
        };

        await runNext();
      });
    }
  };
};

// Load Babel metadata plugin for visual editing AST mapping
const babelPlugins = [];
if (process.env.NODE_ENV !== 'production') {
  try {
    babelPlugins.push(require('./plugins/visual-edits/babel-metadata-plugin'));
  } catch (e) {
    console.warn('[Vite Setup] Could not load Babel metadata plugin:', e.message);
  }
}

module.exports = defineConfig({
  plugins: [
    react({
      babel: {
        plugins: babelPlugins,
      }
    }),
    visualAndHealthPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'build',
  },
  define: {
    // Preserve process.env compatibility in source code
    'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || 'http://localhost:5000/api')
  }
});
