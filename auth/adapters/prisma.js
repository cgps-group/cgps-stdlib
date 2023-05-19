/* eslint-disable new-cap */

const { PrismaAdapter } = require("@next-auth/prisma-adapter");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = PrismaAdapter(prisma);
