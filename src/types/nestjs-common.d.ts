declare module '@nestjs/common' {
  export class ValidationPipe {}
  export class UnauthorizedException extends Error {}
  export class BadRequestException extends Error {}
  export class ConflictException extends Error {}
  export class InternalServerErrorException extends Error {}
  export class NotFoundException extends Error {}

  export function Controller(prefix?: string): ClassDecorator;
  export function Injectable(): ClassDecorator;
  export function Get(path?: string): MethodDecorator;
  export function Post(path?: string): MethodDecorator;
  export function Put(path?: string): MethodDecorator;
  export function Delete(path?: string): MethodDecorator;
  export function Body(pipe?: ValidationPipe): ParameterDecorator;
  export function Param(param?: string, pipe?: ValidationPipe): ParameterDecorator;
  export function Query(param?: string, pipe?: ValidationPipe): ParameterDecorator;
}
