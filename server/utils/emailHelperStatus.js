
const getStatusEmailTemplate = (student, status) => {
  const isAccepted = status === 'accepted';
  const mainColor = isAccepted ? '#1cc88a' : '#e74a3b'; 
  const title = isAccepted ? 'Congratulations! 🎉' : 'Application Update';
  const portalUrl = "http://localhost:3000/portal"; 

  const bodyContent = isAccepted
    ? `
        <div style="text-align: center; margin-bottom: 25px;">
            <p style="font-size: 18px;">Welcome, <strong>${student.full_name}</strong>!</p>
            <p>Your application for the <strong>${student.current_track}</strong> track has been approved. You now have full access to your learning dashboard.</p>
        </div>

        <div style="background-color: #f8f9fa; border: 1px solid #e3e6f0; border-radius: 10px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #4e73df; font-size: 16px;">Internal Portal Credentials</h3>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Login Email:</strong> ${student.email}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Password:</strong> <em>The password you created at signup</em></p>
            <hr style="border: 0; border-top: 1px solid #d1d3e2; margin: 15px 0;">
            <p style="font-size: 13px; color: #858796;">Click the button below to log in and start your free course immediately.</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <a href="${portalUrl}" style="background-color: #1cc88a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(28,200,138,0.2);">
                Go to Student Portal →
            </a>
        </div>
        `
    : `
        <p>Dear ${student.full_name},</p>
        <p>Thank you for your interest in Nyala Digital Academy. After reviewing your application for the <strong>${student.current_track}</strong> track, we are unable to move forward at this time.</p>
        <p>We encourage you to keep learning and apply for our next enrollment cycle.</p>
        `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .container { font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; }
            .header { background: ${mainColor}; padding: 30px; text-align: center; color: white; }
            .content { padding: 30px; line-height: 1.6; color: #333; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #777; }
        </style>
    </head>
    <body style="margin: 0; padding: 0;">
        <div class="container">
            <div class="header">
                <h1 style="margin: 0;">${title}</h1>
            </div>
            <div class="content">
                ${bodyContent}
            </div>
            <div class="footer">
                <p>📍 Nyala, South Darfur | Nyala Digital Academy</p>
            </div>
             <div style="padding: 30px; text-align: center; background-color: #ffffff;">
            <img src="https://res.cloudinary.com/dndvxb9hk/image/upload/v1770707447/nyala-academy-logo_tudtwu.png" 
                 alt="Nyala Digital Academy" 
                 style="height: 60px; width: auto; display: block; margin: 0 auto;" />
        </div>
        </div>
    </body>
    </html>`;
};
module.exports= getStatusEmailTemplate;