import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/services';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';

// Define a User type that matches the Prisma schema
type User = {
  id: string;
  email: string;
  username: string;
  password: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
};

// Define Role enum to match the one in Prisma schema
enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Check if user exists, either by email or username
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        `User with email ${createUserDto.email} or username ${createUserDto.username} already exists`,
      );
    }

    // Hash password
    const hashedPassword = await this.hashPassword(createUserDto.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        username: createUserDto.username,
        password: hashedPassword,
        role: Role.USER,
      },
    });

    // Remove password from returned object
    const { password, ...result } = user;
    return result;
  }

  async createAdmin(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Check if user exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        `User with email ${createUserDto.email} or username ${createUserDto.username} already exists`,
      );
    }

    // Hash password
    const hashedPassword = await this.hashPassword(createUserDto.password);

    // Create admin user
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        username: createUserDto.username,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    // Remove password from returned object
    const { password, ...result } = user;
    return result;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany();
    return users.map(({ password, ...rest }) => rest);
  }

  async findAdmins(): Promise<Omit<User, 'password'>[]> {
    const admins = await this.prisma.user.findMany({
      where: {
        role: Role.ADMIN,
      },
    });
    return admins.map(({ password, ...rest }) => rest);
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, ...result } = user;
    return result;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    // Check if user exists
    await this.findOne(id);

    // Hash password if provided
    const data: any = { ...updateUserDto };
    if (data.password) {
      data.password = await this.hashPassword(data.password);
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    // Remove password from returned object
    const { password, ...result } = updatedUser;
    return result;
  }

  async remove(id: string): Promise<Omit<User, 'password'>> {
    // Check if user exists
    await this.findOne(id);

    // Delete user
    const deletedUser = await this.prisma.user.delete({
      where: { id },
    });

    // Remove password from returned object
    const { password, ...result } = deletedUser;
    return result;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
