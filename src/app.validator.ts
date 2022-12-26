import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class UsesValidOperatorsConstraint
  implements ValidatorConstraintInterface
{
  validate(input: string) {
    // prettier-ignore
    const regex = new RegExp('^[0-9()*\/+-]*$');
    return regex.test(input);
  }
}

export function UsesValidOperators(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UsesValidOperatorsConstraint,
    });
  };
}
