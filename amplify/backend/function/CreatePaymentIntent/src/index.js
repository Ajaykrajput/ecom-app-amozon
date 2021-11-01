const stripe = require('stripe')('sk_test_51JpXWVSJlhsfF00oaPfCQyiAUtboX11z3JVkmhJ2b5cGMYed8Jxz1x14Lv6PFZXQmF4vQKwU0nDhRNyhVjNwrP3a00K0Y2cIzS')

exports.handler = async event => {
const {typeName, arguments} = event;
if (typeName !== 'Mutation') {
    throw new Error ('Request is not a mutation')
}
if (!arguments?.amount) {
    throw new Error ('Amount argument is required')
}
// create payment intent
const paymentIntent = await stripe.paymentIntents.create({
    amount: arguments.amount,
    currency: 'usd'
});
return {
    clientSecret: paymentIntent.clint_secret,
}
};
