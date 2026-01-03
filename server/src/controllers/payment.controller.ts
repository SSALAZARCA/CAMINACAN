import { Request, Response } from 'express';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configurar con Access Token de Prueba (Reemplazar con el del usuario real)
// Este es un token de prueba genérico o placeholder.
// El usuario debería poner su propio token en .env
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-8386927361734267-010216-527e5a72061e88863261642270929255-66778643'
});

export const createPaymentPreference = async (req: Request, res: Response) => {
    try {
        const { items, orderId, purpose } = req.body;
        // items: { id, title, quantity, price }[]

        console.log("Creating preference for:", items);

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: items.map((item: any) => ({
                    id: String(item.id),
                    title: item.name || item.title || 'Producto CaminaCan',
                    quantity: Number(item.quantity),
                    unit_price: Number(item.price),
                    currency_id: 'COP'
                })),
                back_urls: {
                    success: "http://localhost:5173/dashboard?status=success",
                    failure: "http://localhost:5173/dashboard?status=failure",
                    pending: "http://localhost:5173/dashboard?status=pending"
                },
                auto_return: "approved",
                external_reference: orderId || `temp-${Date.now()}`,
                statement_descriptor: "CaminaCan"
            }
        });

        res.json({
            preferenceId: result.id,
            init_point: result.init_point
        });

    } catch (error) {
        console.error("Error creating payment preference:", error);
        res.status(500).json({ error: 'Error creating payment preference' });
    }
};
