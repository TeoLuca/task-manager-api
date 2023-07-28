const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'luca.teodora.stefania@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`
    })
}

const sendCanelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'luca.teodora.stefania@gmail.com',
        subject: 'Cancelation email',
        text: `Goodbye ${name}! Hope to see you soon`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCanelationEmail
}