/* eslint-disable new-cap */

const { PrismaAdapter } = require("@next-auth/prisma-adapter");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// TODO(james): Discuss with Khalil the preferred way to manage this. Suggest the client is passed back from the project
// WHY(james): Doing this here as NextAuth creates Users this as part of its OAuth flow
const prismaExtended = prisma.$extends({
  query: {
    user: {
      async create({ args, query, operation }) {
        // WHY(james): Wrapping in transaction to ensure all required records are created
        const userResult = await prisma.$transaction(async (tx) => {
          const user = await query(args);

          const group = await tx.group.create({
            data: {
              name: user.name,
              createdBy: user.id,
            },
          });

          const groupMembers = await tx.groupMember.create({
            data: {
              userId: user.id,
              groupId: group.id,
            },
          });
          console.log({ group, groupMembers });

          return user; // MAYBE(james): Return all values? Haven't done this as it changes the create API
        });
        return userResult;
      },
    },
  },
});

module.exports = PrismaAdapter(prismaExtended);
