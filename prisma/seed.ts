import db from '../src/models/index';
import bcrypt from "bcrypt"


const password = "password";
const hashed = bcrypt.hashSync(password, 10);

async function main() {
  
  await db.credit.deleteMany({})
  await db.beneficiary.deleteMany({})
  await db.debit.deleteMany({})
  await db.users.deleteMany({})
  await db.users.createMany({
      data: [
          {
              id: "1d809e97-e26e-4597-aff3-070d6bf4599d",
              name: "Donald Paul",
              email: "donald@gmail.com",
              password: hashed,
              balance: 100000
          },
          { 
              id: "1857f7f4-a3e0-4bd4-b1f3-b98c045b4ed2",
              name: "Peter Parker",
              email: "donaldboy1@gmail.com",
              password: hashed,
              balance: 100000
           }
      ],
    skipDuplicates: true,
  });
  console.log("seeding completed........")
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });