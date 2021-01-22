const sgMail = require('@sendgrid/mail');
const Models = require('../../models/index');
const config = require("config");
sgMail.setApiKey(config.get('sendGrid.sendgrid_api_key'));
const fromMail = config.get('sendGrid.fromEmail')

exports.onAdminForgotPassword = onAdminForgotPassword;
exports.sendLoginCredentials = sendLoginCredentials;
exports.onRetailerForgotPassword = onRetailerForgotPassword;
exports.sendConfirmationMail = sendConfirmationMail;
exports.sendActivationEmail = sendActivationEmail;

async function onAdminForgotPassword(payload) {
    try {
        const msg = {
            to: payload.email,
            from: fromMail,
            subject: 'Forgot Password',
            html: ''
        };
        const link = Models.LinkModel.findOne({ user: payload.id });
        if (link) await Models.LinkModel.findOneAndDelete({ _id: link._id });
        const query = await new Models.LinkModel({ user: payload.id }).save();
        let url = `http://localhost:4200/reset-password/${query._id}`;
        msg.html = `<p><a href="${url}"><strong>Click here</strong></a> to reset your password.</p>`;
        const result = await sgMail.send(msg);
        return result
    } catch (error) {
        return error;
    }
}
async function onRetailerForgotPassword(payload) {
    try {
        const msg = {
            to: payload.email,
            from: fromMail,
            subject: 'Forgot Password',
            html: ''
        };
        const link = Models.LinkModel.findOne({ user: payload.id });
        if (link) await Models.LinkModel.findOneAndDelete({ _id: link._id });
        const query = await new Models.LinkModel({ user: payload.id }).save();
        let url = `http://localhost:4023/checkForgotPassword/${query._id}`;
        msg.html = `<p><a href="${url}"><strong>Click here</strong></a> to reset your password.</p>`;
        const result = await sgMail.send(msg);
        console.log('-----loggng resultttt-->>>', result);
        return result
    } catch (error) {
        return error;
    }
}
async function sendLoginCredentials(payload, password) {
    try {
        const msg = {
            to: payload.email,
            from: fromMail,
            subject: 'Welcome OnBoard!',
            html: ''
        };
        msg.html = `<p>You can login using Email ${payload.email} or Phone ${payload.phone} and Your Password is ${password} </p>`;
        await sgMail.send(msg);
        console.log('Email sent successfully!');
    } catch (error) {
        console.log('Email not sent => ', error);
    }
}
async function sendConfirmationMail(payload, password) {
    try {
        const msg = {
            to: payload.email,
            from: fromMail,
            subject: 'Welcome OnBoard!',
            html: ''
        };
        msg.html = `<p>Your account has been sent to admin for confirmation. You'll be notified soon. Email ${payload.email} and Your Password is ${password} </p>`;
        await sgMail.send(msg);
        console.log('Email sent successfully!');
    } catch (error) {
        console.log('Email not sent => ', error);
    }
}
async function sendActivationEmail(payload) {
    try {
        const msg = {
            to: payload.email,
            from: fromMail,
            subject: 'Welcome OnBoard!',
            html: ''
        };
        msg.html = `<p>Your account has been Verified successfully.  </p>`;
        await sgMail.send(msg);
        console.log('Email sent successfully!');
    } catch (error) {
        console.log('Email not sent => ', error);
    }
}