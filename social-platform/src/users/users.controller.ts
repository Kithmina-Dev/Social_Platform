import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new regular user' })
  @ApiResponse({ status: 200, description: 'User created successfully.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create a new admin user', 
    description: 'Create a new user with admin privileges. Only accessible by existing admins.'
  })
  @ApiResponse({ status: 200, description: 'Admin user created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin role.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createAdmin(createUserDto);
  }
  
  @Post('super-admin')
  @ApiOperation({ 
    summary: 'Create the first super admin user', 
    description: 'Create the first admin user in the system. This endpoint can only be used when there are no admin users in the system.'
  })
  @ApiResponse({ status: 200, description: 'Super admin created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin users already exist.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  async createSuperAdmin(@Body() createUserDto: CreateUserDto) {
    // Check if any admin users already exist
    const existingAdmins = await this.usersService.findAdmins();
    if (existingAdmins.length > 0) {
      return {
        statusCode: 403,
        message: 'Admin users already exist in the system. Use the admin endpoint instead.',
      };
    }
    return this.usersService.createAdmin(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
