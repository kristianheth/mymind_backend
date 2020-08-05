'use strict';
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    /**
     * Create node
     */
    async create(ctx) {
        let entity;

        if (ctx.is('multipart')) {
            const { data, files } = parseMultipartData(ctx);

            data.user = ctx.state.user.id;
            entity = await strapi.services.node.create(data, { files });
        } else {
            ctx.request.body.user = ctx.state.user.id;
            entity = await strapi.services.node.create(ctx.request.body);
        }

        return sanitizeEntity(entity, { model: strapi.models.node });
    },

    /**
     * Read nodes
     */
    async find(ctx) {
        let entities;

        ctx.query.user = ctx.state.user.id;

        if (ctx.query._q) {
            entities = await strapi.services.node.search(ctx.query);
        } else {
            entities = await strapi.services.node.find(ctx.query);
        }

        return entities.map(entity => {
            const node = sanitizeEntity(entity, {
                model: strapi.models.node,
            });

            return node;
        });
    },

    /**
     * Read one node
     */
    async findOne(ctx) {
        const { id } = ctx.params;

        const entity = await strapi.services.node.findOne({ id, 'user.id': ctx.state.user.id });
        const node = sanitizeEntity(entity, { model: strapi.models.node });

        return node;
    },

    /**
     * Update node.
     */
    async update(ctx) {
        const { id } = ctx.params;

        let entity;

        const [node] = await strapi.services.node.find({
            id,
            'user.id': ctx.state.user.id,
        });

        if (!node) {
            return ctx.unuserized(`You can't update this entry`);
        }

        if (ctx.is('multipart')) {
            const { data, files } = parseMultipartData(ctx);
            entity = await strapi.services.node.update({ id }, data, {
                files,
            });
        } else {
            entity = await strapi.services.node.update({ id }, ctx.request.body);
        }

        return sanitizeEntity(entity, { model: strapi.models.node });
    },

    /**
     * Update node.
     */
    async delete(ctx) {
        const { id } = ctx.params;

        const entity = await strapi.services.node.delete({ id, 'user.id': ctx.state.user.id });
        return sanitizeEntity(entity, { model: strapi.models.node });
    },
};
