
const getApplyEmailTemplate = (name, track) => {
    return `
<div style="background-color: #f4f7f9; padding: 40px 10px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e1e8ed;">
        
        <div style="padding: 30px; text-align: center; background-color: #ffffff;">
            <img src="https://res.cloudinary.com/dndvxb9hk/image/upload/v1770707447/nyala-academy-logo_tudtwu.png" 
                 alt="Nyala Digital Academy" 
                 style="height: 60px; width: auto; display: block; margin: 0 auto;" />
        </div>

        <div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Application Received!</h1>
        </div>

        <div style="padding: 40px 30px; line-height: 1.6; color: #334155;">
            <p style="font-size: 18px; margin-bottom: 20px;">Hello <strong>${name}</strong>,</p>
            
            <p style="margin-bottom: 25px;">Great news! We've successfully received your application for the <span style="background-color: #e7f3ff; color: #007bff; padding: 2px 8px; border-radius: 4px; font-weight: 600;">${track}</span> track.</p>
            
            <div style="background-color: #fff9db; border-left: 4px solid #fab005; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
                <p style="margin: 0; font-weight: 600; color: #856404;">Status: Pending Review</p>
            </div>

            <p style="margin-bottom: 10px;"><strong>What happens next?</strong></p>
            <ul style="padding-left: 20px; margin-bottom: 30px;">
                <li>Our admissions team in Nyala will evaluate your profile.</li>
                <li>You'll receive a follow-up email regarding the decision within 5-7 business days.</li>
            </ul>

            <div style="text-align: center; margin-top: 40px;">
                <a href="http://localhost:3000/portal" style="background-color: #007bff; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">View Application Portal</a>
            </div>
        </div>

        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 14px; font-weight: 600; color: #475569;">Nyala Digital Academy</p>
            <p style="margin: 5px 0; font-size: 12px; color: #64748b;">📍 Nyala, South Darfur | 📞 +249 123 456 789</p>
        </div>
    </div>
</div>`;
};

module.exports =  getApplyEmailTemplate ;
