import KoaRouter from 'koa-router';
import uuid from 'uuid';

const router = new KoaRouter();

/**
 * Validate all POST requests to ensure
 * they conform to the expected schema.
 *
 * {
 *   action: {string} Name of action function to call
 *   args: {array} Array of arguments to pass to action
 * }
 *
 */
const validatePostRequest = (ctx, next) => {
  const { body, method } = ctx.request;
  if (method !== 'POST') {
    return next();
  }

  if (body
    && typeof body.action === 'string'
    && Array.isArray(body.args)) {
    return next();
  } else {
    ctx.response.status = 500;
    const err = 'Failed to validate. Request body must include \'action\' and \'args\' properties.';
    ctx.body = err;
  }
}

router.use(validatePostRequest);

/**
 * Health check
 *
 * @return {object}
 */
router.get('/_health', async (ctx) => {
  ctx.body = { ok: true };
});

/**
 * Create a new game via broadcast message
 * containing `newGame` action and id.
 *
 * @return {string} ID of new game 
 */
router.get('/games/new', async (ctx) => {
  const id = uuid.v4();
  ctx.ws.broadcast({
    action: 'newGame',
    args: [id],
  });

  ctx.body = id;
});

/**
 * Update the current game via broadcast message
 * containing update action and args.
 *
 * @return {object} Success object
 */
router.post('/games/update', async (ctx) => {
  const { body } = ctx.request;
  ctx.ws.broadcast(body);
  ctx.body = { success: true };
});


export default router;
