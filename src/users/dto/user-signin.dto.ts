import { IS_STRING, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserSignInDto {
    @IsNotEmpty({message: 'Email is required'})
    @IsString({message: 'Email must be a string'})
    @IsEmail({} , {message: 'Please enter a valid email address'})
    email: string;
    @IsNotEmpty({message: 'Password is required'})
    @MinLength(6, {message: 'Password must be at least 6 characters'})
    @MaxLength(15, {message: 'Password must be at most 15 characters'})
    password: string;
}