const { MongoClient } = require('mongodb');

// Replace with your actual MongoDB Atlas connection string
// const uri = "mongodb+srv://mabdullahqureshi583:24JPrQ22Fw8vQKKj@blood-donation.epxxjbo.mongodb.net/?retryWrites=true&w=majority&appName=blood-donation";
const uri = "mongodb+srv://abdullahqureshi:passwordForAbdullahQureshi@blood-donation-web.krmebtv.mongodb.net/?retryWrites=true&w=majority&appName=blood-donation-web";
                

// const uri = "mongodb+srv://abdullah:mGHwEZA15MmFNvVH@blood-donation-web.krmebtv.mongodb.net/bloodDB?retryWrites=true&w=majority";
// const uri = "mongodb+srv://mabdullahqureshi583:24JPrQ22Fw8vQKKj@cluster0.o9i82.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


// const uri = "mongodb://localhost:27017/blood-donation";

async function testMongoConnection() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected successfully to MongoDB Atlas!");

    // Optional: list databases
    const databasesList = await client.db().admin().listDatabases();
    console.log("📂 Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));

  } catch (error) {
    console.error("❌ Failed to connect:", error);
  } finally {
    await client.close();
  }
}

testMongoConnection();
