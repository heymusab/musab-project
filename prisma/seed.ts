import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('password123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@mediconnect.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@mediconnect.com',
      password: hashed,
      role: 'ADMIN',
    },
  });

  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@mediconnect.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'patient@mediconnect.com',
      password: hashed,
      role: 'PATIENT',
    },
  });

  // Dummy Doctor 1
  const doc1 = await prisma.user.upsert({
    where: { email: 'sarah@mediconnect.com' },
    update: {},
    create: { name: 'Dr. Sarah Johnson', email: 'sarah@mediconnect.com', password: hashed, role: 'DOCTOR' },
  });
  const profile1 = await prisma.doctorProfile.upsert({
    where: { userId: doc1.id },
    update: {},
    create: { userId: doc1.id, bio: 'Expert Cardiologist with 15+ years experience.', specialization: 'Cardiology', experience: 15, fee: 150, approved: true },
  });
  await prisma.availability.upsert({
    where: { doctorId_dayOfWeek_startTime: { doctorId: profile1.id, dayOfWeek: 1, startTime: '09:00' } },
    update: {},
    create: { doctorId: profile1.id, dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
  });

  // Dummy Doctor 2
  const doc2 = await prisma.user.upsert({
    where: { email: 'michael@mediconnect.com' },
    update: {},
    create: { name: 'Dr. Michael Chen', email: 'michael@mediconnect.com', password: hashed, role: 'DOCTOR' },
  });
  const profile2 = await prisma.doctorProfile.upsert({
    where: { userId: doc2.id },
    update: {},
    create: { userId: doc2.id, bio: 'Board-certified Dermatologist focusing on skin health.', specialization: 'Dermatology', experience: 8, fee: 200, approved: true },
  });

  // Dummy Doctor 3
  const doc3 = await prisma.user.upsert({
    where: { email: 'emily@mediconnect.com' },
    update: {},
    create: { name: 'Dr. Emily Smith', email: 'emily@mediconnect.com', password: hashed, role: 'DOCTOR' },
  });
  const profile3 = await prisma.doctorProfile.upsert({
    where: { userId: doc3.id },
    update: {},
    create: { userId: doc3.id, bio: 'Friendly Pediatrician dedicated to child care.', specialization: 'Pediatrics', experience: 10, fee: 120, approved: true },
  });

  // Dummy Doctor 4
  const doc4 = await prisma.user.upsert({
    where: { email: 'robert@mediconnect.com' },
    update: {},
    create: { name: 'Dr. Robert Williams', email: 'robert@mediconnect.com', password: hashed, role: 'DOCTOR' },
  });
  const profile4 = await prisma.doctorProfile.upsert({
    where: { userId: doc4.id },
    update: {},
    create: { userId: doc4.id, bio: 'Orthopedic surgeon specializing in sports injuries.', specialization: 'Orthopedics', experience: 20, fee: 250, approved: true },
  });

  console.log('Seed complete. Dummy doctors injected!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
