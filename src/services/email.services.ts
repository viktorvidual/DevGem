
import emailjs from 'emailjs-com';

export const sendEmail = (messageContent: string, emailOfReceiver: string, usernameOfReceiver: string ) => {
    emailjs.send('default_service', 'template_f37fny8', {
      to_email: emailOfReceiver,
      to_name: usernameOfReceiver,
      from_name: 'DEV GEM Team',
      message: messageContent,
    }, 'gitdmzmSLJWM7j5CQ')
    .then((response) => {
      console.log('Email sent successfully!', response);
    })
    .catch((error) => {
      console.error('Email could not be sent:', error);
    });
  };