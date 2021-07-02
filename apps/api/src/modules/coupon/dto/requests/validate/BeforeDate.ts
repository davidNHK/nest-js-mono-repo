import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class BeforeDate implements ValidatorConstraintInterface {
  validate(currentValue: Date, validationArguments: ValidationArguments) {
    const comparingFieldValue =
      validationArguments.object[validationArguments.constraints[0]];
    if (!comparingFieldValue) return true;
    return currentValue?.getTime() < comparingFieldValue?.getTime();
  }
}
