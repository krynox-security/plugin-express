import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyKrynox, type KrynoxResult } from './verify';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** The Krynox verification result, attached by `krynoxCaptcha()` middleware. */
      krynox?: KrynoxResult;
    }
  }
}

export interface KrynoxMiddlewareConfig {
  /** Secret key. Defaults to `process.env.KRYNOX_SECRET_KEY`. */
  secret?: string;
  /** Data-plane host override. Defaults to `process.env.KRYNOX_API_HOST` or `https://api.krynox.net`. */
  apiHost?: string;
  /** Body field carrying the solved token (default `krynox-captcha`). Requires a body parser. */
  field?: string;
  /** Body field carrying the honeypot decoy value (default `krynox-hp`), forwarded to `/siteverify`. */
  honeypotField?: string;
  /** Header checked when the field is absent (default `x-krynox-captcha`) — for fetch/API clients. */
  header?: string;
  /** HTTP methods to enforce on (default POST, PUT, PATCH, DELETE). */
  methods?: string[];
  /** Per-attempt timeout in ms (default 5000). */
  timeoutMs?: number;
  /** Transient-failure retries (default 2). */
  retries?: number;
  /**
   * Custom failure handler. Default responds `403` with
   * `{ success: false, error: 'captcha_failed', 'error-codes': [...] }`.
   */
  onFailure?: (req: Request, res: Response, result: KrynoxResult) => void;
}

function clientIp(req: Request): string | undefined {
  // Express computes req.ip from the socket and only consults forwarding headers
  // when the application explicitly configures `trust proxy`.
  return req.ip || req.socket?.remoteAddress || undefined;
}

/**
 * Express middleware that verifies a Krynox Captcha token before your handler runs. The token is
 * read from the request body field (`krynox-captcha` by default; needs `express.urlencoded()` /
 * `express.json()` mounted first) and falls back to the `x-krynox-captcha` header for API clients.
 *
 * On success the result is attached as `req.krynox` and the chain continues; on failure it responds
 * `403` (override with `onFailure`). Non-enforced methods (GET, …) pass straight through.
 *
 *   import { krynoxCaptcha } from '@krynox/captcha-express';
 *   app.post('/signup', krynoxCaptcha(), (req, res) => {
 *     if (req.krynox?.risk === 'high') { ... }  // add friction
 *     res.send('ok');
 *   });
 */
export function krynoxCaptcha(config: KrynoxMiddlewareConfig = {}): RequestHandler {
  const field = config.field ?? 'krynox-captcha';
  const honeypotField = config.honeypotField ?? 'krynox-hp';
  const header = (config.header ?? 'x-krynox-captcha').toLowerCase();
  const methods = config.methods ?? ['POST', 'PUT', 'PATCH', 'DELETE'];

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!methods.includes(req.method)) {
      next();
      return;
    }

    const body = req.body as Record<string, unknown> | undefined;
    const fromBody = typeof body?.[field] === 'string' ? (body[field] as string) : undefined;
    const token = fromBody ?? (req.headers[header] as string | undefined);
    const honeypot = typeof body?.[honeypotField] === 'string' ? (body[honeypotField] as string) : undefined;

    const result = await verifyKrynox(token, {
      secret: config.secret,
      apiHost: config.apiHost,
      remoteip: clientIp(req),
      honeypot,
      timeoutMs: config.timeoutMs,
      retries: config.retries,
    });
    req.krynox = result;

    if (!result.success) {
      if (config.onFailure) {
        config.onFailure(req, res, result);
        return;
      }
      res.status(403).json({ success: false, error: 'captcha_failed', 'error-codes': result.errorCodes ?? [] });
      return;
    }
    next();
  };
}
