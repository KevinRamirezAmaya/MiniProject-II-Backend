import * as nodemailer from 'nodemailer';

// Interface for email response
interface EmailResponse {
    success: boolean;
    messageId?: string;
    error?: string;
}

const createTransporter = (): nodemailer.Transporter => {
    return nodemailer.createTransport({

        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

const sendPasswordResetEmail = async (email: string, resetToken: string): Promise<EmailResponse> => {
    const transporter = createTransporter();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions: nodemailer.SendMailOptions = {
        from: `"Lumiere Soporte" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reestablece tu contraseña de Lumiere',
        html: `
 <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Reestablecimiento de contraseña cuenta Taskify</title>
            </head>
            <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <!-- Banner with Logo -->
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 6px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                <tr>
                                    <td align="center" style="background-color: #14401A; padding: 30px;">
                                        <!-- Logo dinámico -->
                                        <img src="cid:logo_image" alt="Taskify Logo" width="150" style="display: block; max-width: 150px; height: auto;">
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 40px 30px 10px 30px;">
                                        <h1 style="margin: 0; font-size: 28px; color: #14401A; font-weight: 600;">¡Hola!</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 10px 30px 20px 30px;">
                                        <p style="margin: 0; font-size: 16px; color: #c5c5c5ff; line-height: 1.6;">
                                            Hemos recibido tu solicitud de cambio de contraseña para tu cuenta de Lumiere.<br>
                                            Da clic en el siguiente botón para ser redirigido al cambio de contraseña:

                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 10px 30px;">
                                        <!-- <p style="margin: 0 0 25px 0; font-size: 16px; color: #666666;">
                                            Da clic en el siguiente botón para ser redirigido al cambio de contraseña:
                                        </p>
                                        <!-- Botón estilizado -->
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <tr> 
                                                <td style="border-radius: 8px; background: #14401A; box-shadow: 0 4px 12px rgba(178, 202, 222, 0.3);">
                                                    <a href="${resetURL}" style="display: inline-block; padding: 16px 32px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 8px; transition: all 0.3s ease;">
                                                        Cambiar mi Contraseña
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 30px;">
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 30px;">
                                        <!-- Aviso de seguridad -->
                                        <div style="background-color: #fff7ed; border: 1px solid #fb923c; border-radius: 8px; padding: 20px;">
                                            <p style="margin: 0 0 10px 0; font-weight: bold; color: #ea580c; font-size: 14px;">
                                                ⚠️ Importante:
                                            </p>
                                            <ul style="margin: 5px 0 0 20px; color: #ea580c; font-size: 14px; line-height: 1.5;">
                                                <li>Este enlace expira en <strong>1 hora</strong></li>
                                                <li>Si no realizaste esta solicitud, haz caso omiso a este mensaje</li>
                                                <li>Tu contraseña actual permanece segura hasta que la cambies</li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                                        <p style="margin: 0 0 10px 0; color: #a4b1ac; font-size: 14px;">
                                            Saludos cordiales,
                                        </p>
                                        <p style="margin: 0 0 15px 0; color: #14401A; font-size: 16px; font-weight: 600;">
                                            El equipo de Lumiere
                                        </p>
                                        <p style="margin: 0; color: #bbbbbbbb; font-size: 12px;">
                                            Este es un correo automático, por favor no respondas a esta dirección.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
};

export {
    sendPasswordResetEmail
};