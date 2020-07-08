import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { FollowsService } from './follows.service';
import { Follow } from './follow.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Follow]),
        forwardRef(() => UsersModule),
    ],
    providers: [FollowsService],
    exports: [FollowsService],
})
export class FollowsModule {}
