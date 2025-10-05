import mongoose from 'mongoose'

export default function prepareDatabaseConnection() {
    mongoose.connect(
        process.env.MONGO_CONNECT_URI as string,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        (error) => {
            if (error) return console.log("Database Connection Failed");
            console.log("Database Connection Successful");
        }
    );
};