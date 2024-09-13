import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' } // Ensure this is correctly set
   
});

// Hash passwords before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password') && !this.password.startsWith('$2b$')) {
        console.log('Hashing password in pre-save hook');
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
const User = mongoose.model('User', userSchema);

export default User;
