import { client } from '../src/database/prisma';

async function main() {}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    client.$disconnect();
  });
