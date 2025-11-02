import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
export const register = async (req, res) => {
    try {
        const { username, password, role, email, fullName, gender, cgpa, extracurricularActivities } = req.body;

        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Check if email already exists (if provided)
        if (email) {
            const existingEmail = await User.findOne({ 'profile.email': email });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        // Validate role
        const validRoles = ['user', 'admin'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        // Map gender string to number (male=1, female=0, other=0)
        let genderNum;
        if (gender === 'male') {
            genderNum = 1;
        } else if (gender === 'female' || gender === 'other') {
            genderNum = 0;
        } else {
            genderNum = 0; // default
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Build profile object
        const profile = {};
        if (email) profile.email = email;
        if (fullName) profile.fullName = fullName;
        if (genderNum !== undefined) profile.gender = genderNum;

        const newUser = new User({
            username,
            password: hashedPassword,
            roles: [role || 'user'],
            profile: Object.keys(profile).length > 0 ? profile : undefined,
            // Store additional fields that don't fit in profile schema
            // We'll need to extend the model or store them separately
            cgpa: cgpa,
            extracurricularActivities: extracurricularActivities || [],
        });
        await newUser.save();
        
        res.status(201).json({
            message: 'User registered successfully',
            userId: newUser._id,
            username: newUser.username,
            roles: newUser.roles,
            profile: newUser.profile
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Server error during registration',
            error: error.message
        });
    }
}

export const login = async (req, res) => {
    try {
        const { username, password, } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            {
                id: user._id,
                roles: user.roles,
            }, process.env.JWT_SECRET,
            { expiresIn: '5d' }
        );
        
        // Return user data along with token
        // Map gender: 1 = male, 0 = female/other
        let genderStr = 'other';
        if (user.profile?.gender === 1) genderStr = 'male';
        else if (user.profile?.gender === 0 && user.profile?.gender !== undefined) genderStr = 'female';
        
        res.status(200).json({ 
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.profile?.email || '',
                displayName: user.profile?.fullName || user.username,
                gender: genderStr,
                cgpa: user.cgpa,
                extracurricularActivities: user.extracurricularActivities || [],
                roles: user.roles,
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }

}

