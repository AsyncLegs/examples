import {
    ValidationOptions, registerDecorator, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface
} from 'class-validator';
import {Inject, Service} from "typedi";
import {UserService} from "@domain/users/services";
import {isEmpty} from "lodash";

@Service()
@ValidatorConstraint({async: true})
export class isUserUniqueValidatorConstraint implements ValidatorConstraintInterface {
    @Inject()
    private userService: UserService;

    async validate(email: string, _: ValidationArguments) {
        console.log(email);

        const user = await this.userService.findOnyByEmail(email)
        console.log(user, email);

        return isEmpty(await this.userService.findOnyByEmail(email));
    }

    defaultMessage(args: ValidationArguments) {
        const {value} = args;
        return `Email ${value} is already taken.`;
    }
}

export function IsUserUnique(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: isUserUniqueValidatorConstraint,
        });
    };
}
