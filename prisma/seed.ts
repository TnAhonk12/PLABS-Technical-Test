import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const customers = [
  { name: "Budi", contact: "budi@mail.com", favoriteDrink: "Caramel Cold Brew", interestTags: "sweet drinks, caramel" },
  { name: "Siti", contact: "08123456789", favoriteDrink: "Oat Latte", interestTags: "oat milk, plant based" },
  { name: "Andi", contact: "andi@mail.com", favoriteDrink: "Croissant", interestTags: "pastry lover, morning" },
  { name: "Dewi", contact: "08234567890", favoriteDrink: "Latte Art", interestTags: "workshop, latte art" },
  { name: "Eko", contact: "eko@mail.com", favoriteDrink: "Caramel Macchiato", interestTags: "sweet drinks, caramel" },
  { name: "Fitri", contact: "08134567890", favoriteDrink: "Oat Flat White", interestTags: "oat milk, sweet drinks" },
  { name: "Gita", contact: "gita@mail.com", favoriteDrink: "Pain au chocolat", interestTags: "pastry lover, sweet" },
  { name: "Hadi", contact: "08345678901", favoriteDrink: "Cold Brew", interestTags: "cold brew, minimal sugar" },
  { name: "Indah", contact: "indah@mail.com", favoriteDrink: "Caramel Frappe", interestTags: "sweet drinks, caramel, weekend" },
  { name: "Joko", contact: "08456789012", favoriteDrink: "Espresso + Croissant", interestTags: "pastry lover, morning rush" },
  { name: "Kartika", contact: "kartika@mail.com", favoriteDrink: "Oat Cappuccino", interestTags: "oat milk, workshop" },
  { name: "Lukman", contact: "08567890123", favoriteDrink: "Caramel Latte", interestTags: "sweet drinks, caramel" },
  { name: "Maya", contact: "maya@mail.com", favoriteDrink: "Almond Croissant", interestTags: "pastry lover, plant based" },
  { name: "Nina", contact: "08678901234", favoriteDrink: "Oat Mocha", interestTags: "oat milk, sweet drinks" },
  { name: "Omar", contact: "omar@mail.com", favoriteDrink: "Latte Art Class", interestTags: "workshop, latte art" },
  { name: "Putri", contact: "putri@mail.com", favoriteDrink: "Caramel Oat Latte", interestTags: "oat milk, caramel, sweet drinks" },
  { name: "Rina", contact: "08789012345", favoriteDrink: "Danish pastry", interestTags: "pastry lover, morning" },
  { name: "Surya", contact: "surya@mail.com", favoriteDrink: "Caramel Cold Brew", interestTags: "sweet drinks, caramel, cold brew" },
  { name: "Tari", contact: "08890123456", favoriteDrink: "Oat Latte", interestTags: "oat milk" },
  { name: "Umar", contact: "umar@mail.com", favoriteDrink: "Croissant + Americano", interestTags: "pastry lover, morning rush" },
];

async function main() {
  const hashed = await hash("demo123", 10);
  await prisma.user.upsert({
    where: { email: "mimi@kopikita.com" },
    create: {
      email: "mimi@kopikita.com",
      password: hashed,
      name: "Mimi",
    },
    update: { password: hashed, name: "Mimi" },
  });

  await prisma.customer.deleteMany({});
  for (const c of customers) {
    await prisma.customer.create({
      data: {
        name: c.name,
        contact: c.contact,
        favoriteDrink: c.favoriteDrink,
        interestTags: c.interestTags,
      },
    });
  }

  console.log("Seed done: user mimi@kopikita.com / demo123, and", customers.length, "customers.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
