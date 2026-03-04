import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const profiles = await prisma.doctorProfile.findMany();

    for (const p of profiles) {
        // Weekdays 1 (Monday) to 5 (Friday)
        for (let day = 1; day <= 5; day++) {
            await prisma.availability.upsert({
                where: {
                    doctorId_dayOfWeek_startTime: {
                        doctorId: p.id,
                        dayOfWeek: day,
                        startTime: '09:00',
                    },
                },
                update: {},
                create: {
                    doctorId: p.id,
                    dayOfWeek: day,
                    startTime: '09:00',
                    endTime: '17:00'
                }
            });
        }
    }
    console.log(`Added Monday-Friday availability for ${profiles.length} doctors.`);
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
