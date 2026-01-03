import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const info = await transporter.sendMail({
            from: `"CaminaCan" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        console.log(`Message sent: ${info.messageId}`);
        // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return true;
    } catch (error) {
        console.error("Error sending email: ", error);
        return false;
    }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
    const html = `
    <h1>¡Bienvenido a CaminaCan, ${name}! 🐶</h1>
    <p>Estamos felices de tenerte con nosotros. Ahora podrás encontrar a los mejores paseadores para tu mascota o trabajar con nosotros.</p>
    <p>Si tienes alguna duda, contáctanos.</p>
    `;
    return sendEmail(email, 'Bienvenido a CaminaCan', html);
};

export const sendBookingConfirmation = async (email: string, bookingDetails: any) => {
    const html = `
    <h1>Reserva Confirmada ✅</h1>
    <p>Tu paseo ha sido reservado exitosamente.</p>
    <ul>
        <li><b>Fecha:</b> ${bookingDetails.date}</li>
        <li><b>Hora:</b> ${bookingDetails.time}</li>
        <li><b>Paseador:</b> ${bookingDetails.walkerName}</li>
        <li><b>Precio:</b> $${bookingDetails.price}</li>
    </ul>
    `;
    return sendEmail(email, 'Confirmación de Reserva - CaminaCan', html);
};

export const sendAdminWalkerNotification = async (walkerName: string) => {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@caminacan.com';
    const html = `
    <h1>Nueva Solicitud de Paseador 🚶</h1>
    <p>El usuario <b>${walkerName}</b> ha enviado sus documentos para verificación.</p>
    <p>Por favor revisa el panel administrativo.</p>
    `;
    return sendEmail(adminEmail, 'Nueva Solicitud de Paseador', html);
};

export const sendPasswordReset = async (email: string, token: string) => {
    // In a real app, this link would go to a frontend route like /reset-password?token=XYZ
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    const html = `
    <h1>Recuperar Contraseña</h1>
    <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
    <a href="${resetLink}">Restablecer Contraseña</a>
    <p>Si no fuiste tú, ignora este mensaje.</p>
    `;
    return sendEmail(email, 'Recuperación de Contraseña - CaminaCan', html);
};
