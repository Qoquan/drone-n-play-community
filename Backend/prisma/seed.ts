import { PrismaClient } from "@prisma/client";
import process from "process";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.userBan.deleteMany();
  await prisma.forumModeration.deleteMany();
  await prisma.forumPost.deleteMany();
  await prisma.forumThread.deleteMany();
  await prisma.forum.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.flight.deleteMany();
  await prisma.drone.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.user.deleteMany();
  await prisma.airport.deleteMany();

  // Create test user
  const user1 = await prisma.user.create({
    data: {
      email: "test@example.com",
      username: "testuser",
      password: "hashed_password",
      bio: "Test user",
      role: "admin",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "user2@example.com",
      username: "user2",
      password: "hashed_password",
      role: "user",
    },
  });

  // Create test drone
  const drone = await prisma.drone.create({
    data: {
      name: "DJI Phantom 4",
      model: "Phantom 4 Pro",
      userId: user1.id,
    },
  });

  // Create test flight
  await prisma.flight.create({
    data: {
      droneId: drone.id,
      startTime: new Date(),
      latitude: 50.8503,
      longitude: 4.3517,
      altitude: 100,
    },
  });

  // Create test airport
  await prisma.airport.create({
    data: {
      code: "BRU",
      name: "Brussels-Zaventem",
      latitude: 50.9009,
      longitude: 4.4844,
      city: "Brussels",
      country: "Belgium",
    },
  });

  // Create test forum
  const forum = await prisma.forum.create({
    data: {
      name: "General Discussion",
      description: "General discussion forum",
    },
  });

  // Create test thread
  const thread = await prisma.forumThread.create({
    data: {
      title: "Welcome to Drone'n Play",
      forumId: forum.id,
      userId: user1.id,
    },
  });

  // Create test post
  const post = await prisma.post.create({
    data: {
      content: "Hello, this is a test post!",
      userId: user1.id,
    },
  });

  console.log("✅ Seeding complete!");
  console.log({ user1, user2, drone, forum, thread, post });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });