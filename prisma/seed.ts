import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from "bcrypt";


const prisma = new PrismaClient();

async function main () {

const salt_rounds = 5;

    for (let i = 0; i < 3; i++) {
        const hashedPassword = await bcrypt.hash(faker.internet.password(), salt_rounds)
        const user = await prisma.user.create({
            data: {
                username: faker.internet.userName(),
                password: hashedPassword,
                posts: {
                    create: [
                        {
                        title: faker.lorem.sentence(),
                        content: faker.lorem.paragraph(),
                        },
                        {
                        title: faker.lorem.sentence(),
                        content: faker.lorem.paragraph(),
                        },
                        {
                        title: faker.lorem.sentence(),
                        content: faker.lorem.paragraph(),
                        }
                    ]
                }
            }
        })
    }
}
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })
