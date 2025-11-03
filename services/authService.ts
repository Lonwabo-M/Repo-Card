import { User } from '../types';

const USERS_KEY = 'reportCardProUsers';
const CURRENT_USER_KEY = 'reportCardProCurrentUser';

// Helper to get all users from localStorage
const getUsers = (): User[] => {
    try {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    } catch (e) {
        return [];
    }
};

// Helper to save all users to localStorage
const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const register = (newUser: User): { success: boolean, message: string } => {
    const users = getUsers();
    if (users.some(user => user.email === newUser.email)) {
        return { success: false, message: 'An account with this email already exists.' };
    }
    
    // In a real app, hash the password here. For this simulation, we store it plainly.
    const userToSave: User = { 
        id: Date.now().toString(), 
        name: newUser.name, 
        email: newUser.email, 
        password: newUser.password,
        school: newUser.school,
        province: newUser.province,
    };
    users.push(userToSave);
    saveUsers(users);
    
    return { success: true, message: 'Registration successful! Please log in.' };
};

export const login = (email: string, password_raw: string): { success: boolean, user?: User, message: string } => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password_raw);
    
    if (user) {
        const sessionUser: User = { 
            id: user.id, 
            name: user.name, 
            email: user.email,
            school: user.school,
            province: user.province
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
        return { success: true, user: sessionUser, message: 'Login successful!' };
    }
    
    return { success: false, message: 'Invalid email or password.' };
};

export const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
    try {
        const user = localStorage.getItem(CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    } catch (e) {
        return null;
    }
};

export const requestPasswordReset = (email: string): { success: boolean, message: string, token?: string } => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
        // To prevent user enumeration, we return a success-like message even if the email doesn't exist.
        // In a real app, you would always say "If an account exists, an email has been sent."
        return { success: false, message: "If an account with that email exists, a reset link has been sent." };
    }
    
    // In a real app, use a cryptographically secure random string.
    const token = `reset-${Date.now()}-${Math.random()}`; 
    // Set token to expire in 1 hour (3600000 ms)
    const expiry = Date.now() + 3600000; 

    users[userIndex].resetToken = token;
    users[userIndex].resetTokenExpiry = expiry;
    saveUsers(users);

    console.log(`Password reset for ${email}. Token: ${token}`); // Simulate sending email
    
    return { success: true, message: "Password reset requested.", token: token };
};

export const resetPassword = (token: string, newPassword_raw: string): { success: boolean, message: string } => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.resetToken === token);

    if (userIndex === -1) {
        return { success: false, message: "Invalid or expired password reset token." };
    }

    const user = users[userIndex];
    if (!user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
        users[userIndex].resetToken = undefined;
        users[userIndex].resetTokenExpiry = undefined;
        saveUsers(users);
        return { success: false, message: "Invalid or expired password reset token." };
    }
    
    // In a real app, hash the new password.
    users[userIndex].password = newPassword_raw;
    users[userIndex].resetToken = undefined;
    users[userIndex].resetTokenExpiry = undefined;
    saveUsers(users);

    return { success: true, message: "Your password has been reset successfully." };
};