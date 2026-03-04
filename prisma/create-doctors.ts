import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const doctors = [
        {
            name: 'Dr. Alice Smith',
            email: 'doctor1@gmail.com',
            password: 'doctor1',
            specialization: 'Neurology',
            bio: 'Specialist in neurological disorders with over 10 years of experience.',
            experience: 10,
            fee: 150
        },
        {
            name: 'Dr. Bob Johnson',
            email: 'doctor2@gmail.com',
            password: 'doctor2',
            specialization: 'Psychiatry',
            bio: 'Dedicated psychiatrist focusing on mental health and well-being.',
            experience: 12,
            fee: 120
        },
        {
            name: 'Dr. Catherine Williams',
            email: 'doctor3@gmail.com',
            password: 'doctor3',
            specialization: 'Ophthalmology',
            bio: 'Expert eye surgeon with a passion for vision correction.',
            experience: 8,
            fee: 200
        },
        {
            name: 'Dr. David Brown',
            email: 'doctor4@gmail.com',
            password: 'doctor4',
            specialization: 'Gastroenterology',
            bio: 'Specializing in digestive health and endoscopic procedures.',
            experience: 15,
            fee: 180
        },
        {
            name: 'Dr. Elena Garcia',
            email: 'doctor5@gmail.com',
            password: 'doctor5',
            specialization: 'Oncology',
            bio: 'Compassionate oncologist dedicated to cancer treatment and research.',
            experience: 18,
            fee: 250
        }
    ];

    console.log('Starting to create doctors...');

    for (const doctor of doctors) {
        const hashedPassword = await bcrypt.hash(doctor.password, 12);

        const user = await prisma.user.upsert({
            where: { email: doctor.email },
            update: {
                password: hashedPassword,
                role: 'DOCTOR'
            },
            create: {
                name: doctor.name,
                email: doctor.email,
                password: hashedPassword,
                role: 'DOCTOR'
            }
        });

        const profile = await prisma.doctorProfile.upsert({
            where: { userId: user.id },
            update: {
                specialization: doctor.specialization,
                bio: doctor.bio,
                experience: doctor.experience,
                fee: doctor.fee,
                approved: true
            },
            create: {
                userId: user.id,
                specialization: doctor.specialization,
                bio: doctor.bio,
                experience: doctor.experience,
                fee: doctor.fee,
                approved: true
            }
        });

        // Add some default availability (Monday to Friday, 9:00 to 17:00)
        for (let day = 1; day <= 5; day++) {
            await prisma.availability.upsert({
                where: {
                    doctorId_dayOfWeek_startTime: {
                        doctorId: profile.id,
                        dayOfWeek: day,
                        startTime: '09:00'
                    }
                },
                update: {
                    endTime: '17:00'
                },
                create: {
                    doctorId: profile.id,
                    dayOfWeek: day,
                    startTime: '09:00',
                    endTime: '17:00'
                }
            });
        }

        console.log(`Created/Updated doctor: ${doctor.name} (${doctor.email})`);
    }

    console.log('Finished creating 5 doctors.');
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
