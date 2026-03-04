// Email notifications - uses Resend when RESEND_API_KEY is set
// Otherwise logs to console (dev)

const FROM = process.env.EMAIL_FROM || 'MediConnect <onboarding@resend.dev>';

export async function sendEmail(to: string, subject: string, html: string) {
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({ from: FROM, to: [to], subject, html });
    if (error) console.error('Resend error:', error);
    return !error;
  }
  console.log('[Email]', { to, subject, html: html.slice(0, 80) + '...' });
  return true;
}

export async function sendAppointmentBooked(to: string, doctorName: string, date: string, time: string) {
  return sendEmail(
    to,
    'Appointment Booked - MediConnect',
    `Your appointment with ${doctorName} is booked for ${date} at ${time}. Status: Pending until the doctor confirms.`
  );
}

export async function sendAppointmentConfirmed(to: string, doctorName: string, date: string, time: string) {
  return sendEmail(
    to,
    'Appointment Confirmed - MediConnect',
    `Your appointment with ${doctorName} on ${date} at ${time} has been confirmed.`
  );
}

export async function sendAppointmentReminder(to: string, doctorName: string, date: string, time: string) {
  return sendEmail(
    to,
    'Reminder: Appointment Tomorrow - MediConnect',
    `Reminder: You have an appointment with ${doctorName} on ${date} at ${time}.`
  );
}
