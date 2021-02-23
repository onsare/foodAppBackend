"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const stripe_secret_key = "";

const stripe = require("Stripe")(
  stripe_secret_key || process.env.STRIPE_SECRET_KEY
);

module.exports = {
  /**
   * create an order
   *
   * @return { Object }
   */
  create: async (ctx) => {
    const { address, city, amount, dishes, token, state } = JSON.parse(
      ctx.request.body
    );

    const stripeAmount = Math.floor(amount * 100);

    //charge on stripe
    const charge = await stripe.charges.create({
      amount: stripeAmount,
      currency: "usd",
      description: ` new order ${new Date()} by ${ctx.state.user.id}`,
      source: token,
    });

    //register the charge to db

    const order = await strapi.services.order.create({
      user: ctx.state.user.id,
      charge_id: charge.id,
      amount: amount,
      address,
      dishes,
      city,
      state,
    });

    return order;
  },
};
