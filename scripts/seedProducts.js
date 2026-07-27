/**
 * One-time script to push the original product catalog into Firestore.
 * Run with: npm run seed
 */

import admin from "firebase-admin";
import { seedProducts } from "../src/data/seedProducts.js";
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function run() {
  for (const product of seedProducts) {
    await db
      .collection("products")
      .doc(String(product.id))
      .set(product);

    console.log(`Seeded: ${product.name}`);
  }

  console.log("Done seeding products.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});