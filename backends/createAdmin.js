import bcrypt from 'bcrypt';
import Admin  from './models/admin.js';
import sequelize from './config/db.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createAdminUser = async () => {
  try {
    // Ask for admin details interactively
    const username = await question('Enter username: ');
    const email = await question('Enter email: ');
    const password = await question('Enter password: ');

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin user already exists
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      console.log('Admin user with this email already exists!');
      return;
    }

    // Create new admin user
    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin user created successfully:', admin.toJSON());
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Close the readline interface and the database connection
    rl.close();
    await sequelize.close();
  }
};

createAdminUser();
