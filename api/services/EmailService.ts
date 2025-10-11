import nodemailer from 'nodemailer';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

/**
 * Configuración para el servicio de email
 */
interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

/**
 * Opciones para enviar un correo
 */
interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

/**
 * Servicio para el envío de correos electrónicos
 */
export class EmailService {
    private transporter: nodemailer.Transporter;
    private from: string;

    /**
     * Inicializa el servicio de email con la configuración desde variables de entorno
     */
    constructor() {
        const emailConfig: EmailConfig = {
            host: process.env.EMAIL_HOST || 'smtp.example.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER || '',
                pass: process.env.EMAIL_PASS || ''
            }
        };

        this.from = process.env.EMAIL_FROM || 'no-reply@lumiere.com';
        this.transporter = nodemailer.createTransport(emailConfig);
    }

    /**
     * Envía un correo electrónico
     * 
     * @param options - Opciones del correo a enviar
     * @returns Promise<boolean> - True si se envió correctamente
     */
    async sendEmail(options: EmailOptions): Promise<boolean> {
        try {
            const mailOptions = {
                from: this.from,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: %s', info.messageId);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }

    /**
     * Envía un correo de restablecimiento de contraseña
     * 
     * @param to - Dirección de correo del destinatario
     * @param resetLink - Enlace para restablecer la contraseña
     * @param username - Nombre de usuario
     * @returns Promise<boolean> - True si se envió correctamente
     */
    async sendPasswordResetEmail(to: string, resetLink: string, username: string): Promise<boolean> {
        const subject = 'Restablecer contraseña de Lumiere';
        
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3498db;">Restablecer tu contraseña</h2>
                <p>Hola ${username},</p>
                <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Lumiere.</p>
                <p>Para continuar, haz clic en el siguiente enlace:</p>
                <p>
                    <a href="${resetLink}" style="background-color: #3498db; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Restablecer mi contraseña
                    </a>
                </p>
                <p>O copia y pega la siguiente URL en tu navegador:</p>
                <p style="word-break: break-all;">${resetLink}</p>
                <p>Este enlace expirará en 1 hora.</p>
                <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="color: #7f8c8d; font-size: 12px;">Este es un mensaje automático, por favor no respondas a este correo.</p>
            </div>
        `;

        const text = `
            Restablecer tu contraseña
            
            Hola ${username},
            
            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Lumiere.
            
            Para continuar, visita el siguiente enlace:
            ${resetLink}
            
            Este enlace expirará en 1 hora.
            
            Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje.
        `;

        return await this.sendEmail({
            to,
            subject,
            text,
            html
        });
    }
}

// Exportar una instancia única del servicio
export default new EmailService();