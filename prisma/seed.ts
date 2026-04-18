import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("staff2026", 12);

  await prisma.staff.upsert({
    where: { email: "admin@desaguntingmanggis.id" },
    update: {},
    create: {
      email: "admin@desaguntungmanggis.id",
      nama: "Administrator",
      password: hashedPassword,
    },
  });

  console.log("Seed done: admin@desaguntungmanggis.id / staff2026");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
