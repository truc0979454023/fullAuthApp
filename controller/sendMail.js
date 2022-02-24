const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const { OAuth2 } = google.auth;

const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground'

const {
    MALING_SERVICE_CLIENT_ID,
    MALING_SERVICE_CLIENT_SECRET,
    MALING_SERVICE_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS,
} = process.env


const oauth2Client = new OAuth2(
    MALING_SERVICE_CLIENT_ID,
    MALING_SERVICE_CLIENT_SECRET,
    MALING_SERVICE_REFRESH_TOKEN,
    OAUTH_PLAYGROUND,
)


//send email
const sendEmail = (to, url, txt) => {
    oauth2Client.setCredentials({
        refresh_token: MALING_SERVICE_REFRESH_TOKEN
    })

    const accessToken = oauth2Client.getAccessToken()
    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: 'OAuth2',
            user: SENDER_EMAIL_ADDRESS,
            clientId: MALING_SERVICE_CLIENT_ID,
            clientSecret: MALING_SERVICE_CLIENT_SECRET,
            refreshToken: MALING_SERVICE_REFRESH_TOKEN,
            accessToken
        }
    })

    const mailOptions = {
        from: SENDER_EMAIL_ADDRESS,
        to: to,
        subject: 'Demo channel',
        html: `
            <div style="max-width:700px;margin:auto;border:10px solid #ddd; padding:50px 20px;">
                <h2 style="text-align:center; teat-transform:uppercase; color:teal;">Wecome to Channel</h2>
                <p> Just click the button below to validate your email address.</p>
                <a href=${url} style="background:crimson;text-decoration:none;color:white;padding:10px 20px;margin:10px 0";display:inline-block>${txt}</a>
                
                <p>If the button doesn't work for any reason, you can also click on the link below:</p>
                <div>${url}</div>
            </div>
        `
    }

    smtpTransport.sendMail(mailOptions, (err, infor) => {
        if (err) return err;
        return infor
    })
}

module.exports = sendEmail