import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.contact.createMany({
    data: [
      { email: "1user@example.com", phoneNumber: "1234567890", linkPrecedence: "primary" },
      { email: "newuser@example.com", phoneNumber: "1234567890", linkPrecedence: "secondary", linkedId: 1 },
      { email: "anotheruser@example.com", phoneNumber: "1234567890", linkPrecedence: "secondary", linkedId: 1 },
      { email: "newcontact@example.com", phoneNumber: "2222222222", linkPrecedence: "primary" },
    ],
  });
}

main()
  .then(() => console.log("Seed data created"))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
