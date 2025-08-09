import { IS_STRING, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { UserSignInDto } from './user-signin.dto';

export class UserSignupDto extends UserSignInDto{
    @IsNotEmpty({message: 'Name is required'})
    @IsString({message: 'Name must be a string'})
    name: string;
}