import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { SupportsService } from './supports.service';
import { Support } from './support.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Support]),
        forwardRef(() => UsersModule),
    ],
    providers: [SupportsService],
    exports: [SupportsService],
})
export class SupportsModule {}
