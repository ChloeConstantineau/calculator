import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class UsesValidOperatorsConstraint
  implements ValidatorConstraintInterface
{
  validate(input: string, _: ValidationArguments) {
    // prettier-ignore
    const regex = new RegExp('^[0-9()*\/+-]*$');
    return regex.test(input);
  }
}

export function UsesValidOperators(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UsesValidOperatorsConstraint,
    });
  };
}
