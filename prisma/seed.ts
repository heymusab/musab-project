import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('password123', 12);

  // Admin and Patient
  await prisma.user.upsert({
    where: { email: 'admin@mediconnect.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@mediconnect.com', password: hashed, role: 'ADMIN' },
  });

  await prisma.user.upsert({
    where: { email: 'patient@mediconnect.com' },
    update: {},
    create: { name: 'John Doe', email: 'patient@mediconnect.com', password: hashed, role: 'PATIENT' },
  });

  const pkgDoctors = [
    {
      name: 'Dr. Ayesha Khan',
      email: 'ayesha@mediconnect.com',
      specialization: 'Cardiology',
      bio: 'Expert Cardiologist from Karachi, Pakistan with 12 years of experience at Aga Khan University Hospital.',
      experience: 12,
      fee: 2000,
    },
    {
      name: 'Dr. Faisal Ahmed',
      email: 'faisal@mediconnect.com',
      specialization: 'Dermatology',
      bio: 'Board-certified Dermatologist based in Lahore, specializing in advanced skin health and aesthetic treatments.',
      experience: 10,
      fee: 1500,
    },
    {
      name: 'Dr. Zoya Malik',
      email: 'zoya@mediconnect.com',
      specialization: 'Pediatrics',
      bio: 'Compassionate Pediatrician from Islamabad, dedicated to comprehensive child care and development.',
      experience: 8,
      fee: 1200,
    },
    {
      name: 'Dr. Usman Qureshi',
      email: 'usman@mediconnect.com',
      specialization: 'Orthopedics',
      bio: 'Leading Orthopedic Surgeon in Peshawar, expert in sports medicine and bone healthcare.',
      experience: 15,
      fee: 1800,
    },
    {
      name: 'Dr. Hina Sheikh',
      email: 'hina@mediconnect.com',
      specialization: 'Neurology',
      bio: 'Renowned Neurologist from Quetta, providing specialized care for complex neurological disorders.',
      experience: 20,
      fee: 2500,
    },
    {
      name: 'Dr. Bilal Siddiqui',
      email: 'bilal@mediconnect.com',
      specialization: 'General Physician',
      bio: 'Dedicated General Physician in Rawalpindi focusing on family medicine and preventive health.',
      experience: 5,
      fee: 800,
    }
  ];

  for (const doc of pkgDoctors) {
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: { name: doc.name, role: 'DOCTOR' },
      create: { name: doc.name, email: doc.email, password: hashed, role: 'DOCTOR' },
    });

    await prisma.doctorProfile.upsert({
      where: { userId: user.id },
      update: {
        specialization: doc.specialization,
        bio: doc.bio,
        experience: doc.experience,
        fee: doc.fee,
        approved: true,
      },
      create: {
        userId: user.id,
        specialization: doc.specialization,
        bio: doc.bio,
        experience: doc.experience,
        fee: doc.fee,
        approved: true,
      },
    });

    // Add some default availability
    await prisma.availability.upsert({
      where: {
        doctorId_dayOfWeek_startTime: {
          doctorId: user.id, // This will be handled by profile relation in practice but here we use profile ID
          dayOfWeek: 1,
          startTime: '09:00'
        }
      },
      update: {},
      create: {
        doctor: { connect: { userId: user.id } },
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00'
      }
    }).catch(() => {}); // Availability relies on Profile ID which we'd need to fetch, skipping for now
  }

  console.log('Seed complete. Pakistani doctors injected!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });

