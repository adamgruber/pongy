import KoaRouter from 'koa-router';
import { plural } from 'pluralize';
import * as models from '../models';

const router = new KoaRouter({
  prefix: '/api'
});

const getRouteName = modelName => plural(modelName.toLowerCase());

const success = data => ({
  status: 'success',
  data,
});

const fail = err => ({
  status: 'fail',
  error: err.message,
});

const generateActions = (model, routeName) => ({
  /**
   * Get all documents for a given model
   *
   * @return {object} Array of documents
   */
  findAll: async (ctx, next) => {
    const { query } = ctx.request;
    const { limit, skip, sort, fields, expand } = query;

    // Set query options
    const options = {
      limit: parseInt(limit, 10) || undefined,
      skip: parseInt(skip, 10) || undefined,
      sort,
    };

    // Extract fields to select
    const select = (fields || '').split(',');

    // Extract fields to expand
    const populate = (expand || '').split(',')

    // Create the search query
    const q = model.find({}, select.join(' '), options);

    // Add any expansion directives
    populate.forEach(populateField => q.populate(populateField));

    try {
      const res = await q.exec();
      ctx.ok(success(res));
    } catch (err) {
      ctx.body = err;
    }
    await next();
  },

  /**
   * Get a single document by ID
   *
   * @return {object} Response
   */
  findById: async (ctx, next) => {
    const { params } = ctx;
    try {
      const res = await model.findById(params.id);
      if (!res) {
        ctx.notFound();
      } else {
        ctx.ok(success(res));
      };
    } catch (err) {
      ctx.notFound();
    }
    await next();
  },

  /**
   * Create and save a new document of a given model
   *
   * @return {object} ID of new document
   */
  create: async (ctx, next) => {
    const { body } = ctx.request;
    try {
      const res = await model.create(body);
      ctx.created(success(res.id));
    } catch (err) {
      ctx.badRequest(fail(err));
    }
    await next();
  },

  /**
   * Update a single document by ID
   *
   * @return {object} Response
   */
  updateById: async (ctx, next) => {
    const { params, request } = ctx;
    const { body } = request;
    try {
      const res = await model.findByIdAndUpdate(params.id, body, { new: true });
      if (!res) {
        ctx.notFound();
      } else {
        ctx.ok(success(res));
      };
    } catch (err) {
      console.log(err);
      if (
        err.message.includes('Invalid')
        || err.message.includes('Validation failed')
      ) {
        ctx.badRequest(fail(err));
      } else if (err.code === 11000) {
        ctx.internalServerError(fail(err));
      } else {
        ctx.notFound();
      }
    }
    await next();
  },

  /**
   * Delete a single document by ID
   *
   * @return {object} Response
   */
  deleteById: async (ctx, next) => {
    const { params } = ctx;
    try {
      const res = await model.findByIdAndRemove(params.id);
      if (!res) {
        ctx.notFound();
      } else {
        ctx.ok(success(res))
      };
    } catch (err) {
      ctx.notFound()
    }
    await next();
  },
});

const generateRoutes = (model, actions, routeName, router) => {
  router.get(`/${routeName}`, actions.findAll);
  router.get(`/${routeName}/:id`, actions.findById);
  router.post(`/${routeName}`, actions.create);
  router.delete(`/${routeName}/:id`, actions.deleteById);
  router.patch(`/${routeName}/:id`, actions.updateById);
}

Object.keys(models).forEach(modelName => {
  const routeName = getRouteName(modelName);
  const model = models[modelName];
  const actions = generateActions(model, routeName);
  generateRoutes(model, actions, routeName, router);
});

export default router;
