import { prisma } from "@repo/database";

prisma.user.findFirst();
prisma.deployment.findFirst()