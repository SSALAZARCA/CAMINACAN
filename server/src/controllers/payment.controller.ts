import { Request, Response } from 'express';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import prisma from '../utils/db';

export const createPaymentPreference = async (req: Request, res: Response) => {
    try {
        const { items, orderId } = req.body;

        // 1. Get Config from DB
        const config = await prisma.systemConfig.findFirst();
        const accessToken = config?.mercadopagoAccessToken || process.env.MERCADOPAGO_ACCESS_TOKEN;

        if (!accessToken) {
            return res.status(500).json({ error: 'MercadoPago not configured in admin settings' });
        }

        const client = new MercadoPagoConfig({ accessToken });
        const preference = new Preference(client);

        const frontendUrl = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173';

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
                    success: `${frontendUrl}/dashboard?status=success`,
                    failure: `${frontendUrl}/tienda?status=failure`,
                    pending: `${frontendUrl}/tienda?status=pending`
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
