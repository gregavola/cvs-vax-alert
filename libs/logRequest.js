const connectToDatabase = require("./connect");

async function logRequest(colName, city, status) {
  const db = await connectToDatabase(process.env.MONGODB_URI);

  const collection = await db.collection(colName);

  const query = { city };
  const update = {
    $set: {
      city,
      status,
      createdAt: new Date(),
    },
  };

  const options = { upsert: true };
  const response = await collection.updateOne(query, update, options);

  console.log(response.result.ok);
}

module.exports = logRequest;
