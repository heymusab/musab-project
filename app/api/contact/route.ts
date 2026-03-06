import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { saveMessage } from '@/lib/contact-db';

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // 1. Save to local database (Always works)
        await saveMessage({ name, email, message });

        // 2. Try to send email (May fail if no API key, but that's okay)
        const adminEmail = process.env.CONTACT_RECEIVER_EMAIL || 'ecombymusab@gmail.com';

        const emailContent = `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `;

        try {
            await sendEmail(
                adminEmail,
                `New Message from ${name} - MediConnect`,
                emailContent
            );
        } catch (emailError) {
            console.error('Email sending skipped or failed:', emailError);
        }

        return NextResponse.json({ success: true, message: 'Message saved successfully' });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
    }
}
