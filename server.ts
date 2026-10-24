import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { request as httpRequest, RequestOptions } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import AppServerModule from './src/main.server';

const apiTarget = new URL(process.env['API_PROXY_TARGET'] || 'http://3.129.17.140:3001');

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.use('/api', (req, res) => {
    const headers = { ...req.headers, host: apiTarget.host };
    delete headers['origin'];
    delete headers['referer'];

    const options: RequestOptions = {
      protocol: apiTarget.protocol,
      hostname: apiTarget.hostname,
      port: apiTarget.port,
      method: req.method,
      path: req.originalUrl,
      headers,
    };
    const send = apiTarget.protocol === 'https:' ? httpsRequest : httpRequest;
    const proxyReq = send(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', () => {
      if (!res.headersSent) {
        res.status(502).json({ success: false, message: 'API no disponible' });
      }
    });

    req.pipe(proxyReq);
  });

  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
