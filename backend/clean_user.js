const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const User = require('./models/User');

async function cleanUser() {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const email = 'kanishkaa1302@gmail.com';
        const result = await User.deleteOne({ email });

        if (result.deletedCount > 0) {
            console.log(`Successfully deleted user: ${email}`);
        } else {
            console.log(`User not found: ${email}`);
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

cleanUser();
