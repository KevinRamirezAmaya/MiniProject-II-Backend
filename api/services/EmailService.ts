/**
 * Email service for the Lumiere Movie API
 * 
 * Handles sending emails using SendGrid API, specifically for password reset
 * functionality and other user communication needs.
 * 
 * @fileoverview Email service implementation using SendGrid
 * @requires @sendgrid/mail
 */

import sgMail from '@sendgrid/mail';

/**
 * Initialize SendGrid API key from environment variables
 * This must be set before any email operations can be performed
 */
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

/**
 * Interface for email sending response
 * 
 * @interface EmailResponse
 */
interface EmailResponse {
  /** Whether the email was sent successfully */
  success: boolean;
  /** The message ID from SendGrid (if successful) */
  messageId?: string;
  /** Error message (if failed) */
  error?: string;
}

/**
 * Send a password reset email to a user
 * 
 * Creates and sends a professionally formatted HTML email with password reset instructions.
 * The email includes a reset link, security information, and branded styling.
 * 
 * @async
 * @function sendPasswordResetEmail
 * @param {string} email - The recipient's email address
 * @param {string} resetToken - The unique token for password reset
 * @returns {Promise<EmailResponse>} Promise that resolves to email sending result
 * 
 * @example
 * ```typescript
 * const result = await sendPasswordResetEmail('user@example.com', 'abc123token');
 * if (result.success) {
 *   console.log('Email sent successfully:', result.messageId);
 * } else {
 *   console.error('Email failed:', result.error);
 * }
 * ```
 */
const sendPasswordResetEmail = async (email: string, resetToken: string): Promise<EmailResponse> => {
  /**
   * Construct the password reset URL using the frontend URL and token
   */
  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  /**
   * Email message configuration object
   * Contains recipient, sender, subject, and HTML content
   */
  const msg = {
    /** Recipient email address */
    to: email,
    /** Sender information */
    from: {
      email: process.env.EMAIL_SENDER as string,
      name: "Lumiere Soporte"
    },
    /** Email subject line */
    subject: "Reestablece tu contraseña de Lumiere",
    /** HTML email content with embedded styling and branding */
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Reestablecimiento de contraseña - Lumiere</title>
</head>
<body style="margin:0; padding:0; background-color:#000000; font-family: Arial, Helvetica, sans-serif; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#000000; padding:24px 0;">
    <tr>
      <td align="center">
        <!-- Contenedor principal -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px; width:100%; background:#0a0a0a; border-radius:8px; overflow:hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.6);">
          
          <!-- Header / barra superior -->
          <tr>
            <td align="center" style="background: linear-gradient(90deg,#05120b,#00150d); padding:28px;">
              <!-- Logo (si usas CID, mantener cid:logo_image) -->
              <img src="cid:logo_image" alt="Lumiere" width="140" style="display:block; height:auto; max-width:140px;">
            </td>
          </tr>

          <!-- Título -->
          <tr>
            <td style="padding:30px 28px 12px 28px; text-align:center;">
              <h1 style="margin:0; font-size:26px; line-height:1.1; color:#e6fff6; font-weight:700;">
                Restablece tu contraseña
              </h1>
            </td>
          </tr>

          <!-- Mensaje principal -->
          <tr>
            <td style="padding:0 28px 20px 28px; text-align:center;">
              <p style="margin:0; color:#bfeee0; font-size:15px; line-height:1.6;">
                Hemos recibido una solicitud para cambiar la contraseña de tu cuenta de <strong>Lumiere</strong>.
                Haz clic en el botón de abajo para crear una nueva contraseña. Este enlace expira en <strong>1 hora</strong>.
              </p>
            </td>
          </tr>

          <!-- Botón -->
          <tr>
            <td align="center" style="padding:16px 28px 26px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px; background:linear-gradient(180deg,#00d084,#00b86a);">
                    <a href="${resetURL}" target="_blank" style="display:inline-block; padding:14px 30px; font-size:16px; color:#00140a; font-weight:700; text-decoration:none; border-radius:8px;">
                      Cambiar mi contraseña
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Texto alternativo y seguridad -->
          <tr>
            <td style="padding:0 28px 18px 28px;">
              <p style="margin:0; color:#96e8c9; font-size:13px; line-height:1.5;">
                Si no puedes pulsar el botón, copia y pega este enlace en tu navegador:
              </p>
              <p style="word-break:break-all; margin:8px 0 0 0; color:#8af2c6; font-size:13px;">
                <a href="${resetURL}" target="_blank" style="color:#8af2c6; text-decoration:underline;">${resetURL}</a>
              </p>
            </td>
          </tr>

          <!-- Información de seguridad (caja) -->
          <tr>
            <td style="padding:18px 28px;">
              <div style="background:#07120f; border:1px solid rgba(0,208,132,0.12); border-radius:8px; padding:14px;">
                <p style="margin:0 0 8px 0; color:#00d084; font-weight:700; font-size:14px;">
                  ⚠️ Importante
                </p>
                <ul style="margin:0; padding-left:18px; color:#b9f7dd; font-size:13px; line-height:1.5;">
                  <li>El enlace expira en <strong>1 hora</strong>.</li>
                  <li>Si no solicitaste este cambio, puedes ignorar este correo.</li>
                  <li>Tu contraseña actual se mantendrá segura hasta que la cambies.</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Pie / firma -->
          <tr>
            <td style="padding:22px 28px 36px 28px; text-align:center; background:linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.03));">
              <p style="margin:0 0 6px 0; color:#b9f7dd; font-size:14px;">
                Saludos cordiales,
              </p>
              <p style="margin:0 0 12px 0; color:#e6fff6; font-weight:700; font-size:15px;">
                El equipo de Lumiere
              </p>
              <p style="margin:0; color:#6a6f6b; font-size:12px;">
                Este es un correo automático — por favor no respondas a esta dirección.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Fin contenedor principal -->
      </td>
    </tr>
  </table>
</body>
</html>
`
  };

  try {
    // Send email using SendGrid
    const [response] = await sgMail.send(msg);
    return { 
      success: true, 
      messageId: response.headers['x-message-id'] 
    };
  } catch (error: any) {
    // Log error and return failure response
    console.error("Email sending failed:", error);
    return { 
      success: false, 
      error: error.message || 'Unknown error' 
    };
  }
};

/**
 * Export email service functions
 * 
 * @exports {Function} sendPasswordResetEmail - Function to send password reset emails
 */
export { sendPasswordResetEmail };
