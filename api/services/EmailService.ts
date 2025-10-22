import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

const sendPasswordResetEmail = async (email: string, resetToken: string): Promise<EmailResponse> => {
  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const msg = {
    to: email,
    from: {
      email: process.env.EMAIL_SENDER as string,
      name: "Lumiere Soporte"
    },
    subject: "Reestablece tu contraseña de Lumiere",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2>¡Hola!</h2>
          <p>Hemos recibido tu solicitud de cambio de contraseña.</p>
          <p>
            <a href="${resetURL}" style="background:#14401A;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;">
              Cambiar mi Contraseña
            </a>
          </p>
          <p>Este enlace expira en 1 hora.</p>
        </body>
      </html>
    `,
  };

  try {
    const [response] = await sgMail.send(msg);
    return { success: true, messageId: response.headers['x-message-id'] };
  } catch (error: any) {
    console.error("Email sending failed:", error);
    return { success: false, error: error.message || 'Unknown error' };
  }
};

export { sendPasswordResetEmail };
