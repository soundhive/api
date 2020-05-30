import { Exists } from "src/validators/exists.validation";
import { User } from "src/users/user.entity";

export class CreateSupportDTO {
   

    @Exists(User)
    to: User;

    @Exists(User)
    from: User;
}