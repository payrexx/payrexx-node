require('dotenv').config();
const Payrexx = require('./lib/Payrexx');

const payrexx = new Payrexx(
    process.env.INSTANCE,
    process.env.APIKEY
)

payrexx.post('Gateway', {
    amount: 100,
    currency: 'CHF',
    vatRate: 7.7,
    purpose: 't()est',
    psp: [
        44,
        36
    ],
    pm: [
        'visa',
        'mastercard',
        'twint',
        'amex',
    ],
    fields: {
        email: {
            value: 'testmail@testdomain.com'
        },
        forename: {
            value: 'Max'
        },
        surname: {
            value: 'Muster'
        }
        // add more field values here
    }
    // add more settings here
})
    .then((result) => {
        if (result.status !== 'success') {
            console.error(result.message);
            return;
        }
        console.log(result.data);
    })