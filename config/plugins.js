module.exports = ({ env }) => ({
    email: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME', "03vominhtu@gmail.com@gmail.com"),
          pass: env('SMTP_PASSWORD', "0810quynh"),
        },
        // ... any custom nodemailer options
      },
      settings: {
        defaultFrom: '03vominhtu@gmail.com@gmail.com',
        defaultReplyTo: '03vominhtu@gmail.com@gmail.com',
      },
    },
  });