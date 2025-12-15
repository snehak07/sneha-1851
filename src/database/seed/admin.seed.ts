import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../users/user.entity';
import { UserRole } from '../../users/role.enum';

export async function adminSeed(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL or ADMIN_PASSWORD not set in .env');
  }

  const existingAdmin = await userRepo.findOne({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('Admin already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = userRepo.create({
    email: adminEmail,
    password: hashedPassword,
    role: UserRole.ADMIN,
  });

  await userRepo.save(admin);

  console.log('Admin seeded successfully');
}
