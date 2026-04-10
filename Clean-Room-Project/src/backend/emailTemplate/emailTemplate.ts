export const resetPasswordEmailTemplate = (
    firstName: string,
    resetLink: string
  ): string => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 500px;
                  margin: 0 auto; padding: 20px;">
  
        <div style="background: #0d9488; padding: 20px;
                    border-radius: 8px 8px 0 0; text-align: center;">
          <h2 style="color: white; margin: 0; font-weight: bold;">
            STERI Clean Air (Arrant Dynamics)
          </h2>
           HVAC Matrix Platform
          </p>
        </div>
  
        <div style="background: #fff; padding: 24px;
                    border: 1px solid #e5e7eb;
                    border-top: none; border-radius: 0 0 8px 8px;">
  
          <h3 style="color: #111827; font-weight: bold;">Reset Your Password</h3>
  
          <!-- firstName from tUsers.user_first_name -->
          <p style="color: #6b7280;">
            Hi <strong>${firstName}</strong>,
          </p>
  
          <p style="color: #6b7280;">
            We received a request to reset your password for your
            <strong>STERI Clean Air</strong> account.
            Click the button below to reset it.
          </p>
  
          <!-- resetLink contains raw token in URL -->
          <div style="text-align: center; margin: 24px 0;">
            <a href="${resetLink}"
               style="display: inline-block; background-color: #0d9488;
                      color: white; padding: 12px 32px; border-radius: 6px;
                      text-decoration: none; font-weight: bold; font-size: 15px;">
              Reset Password
            </a>
          </div>
  
          <!-- Token expires in 15 minutes -->
          <p style="color: #6b7280; font-size: 13px;">
          This link expires in <strong>15 minutes</strong>.
        </p>
  
          <p style="color: #6b7280; font-size: 13px;">
            If you didn't request this, you can safely ignore this email.
          </p>
  
          <hr style="border-color: #e5e7eb; margin-top: 24px;" />
  
          <p style="color: #9ca3af; font-size: 11px; text-align: center;">
            © <strong>STERI Clean Air</strong> —
            <strong>Arrant Dynamics</strong> HVAC Matrix Platform
          </p>
  
        </div>
      </div>
    `;
  };