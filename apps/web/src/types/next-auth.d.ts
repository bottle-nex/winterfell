import { UserType } from '@/app/api/auth/[...nextauth]/options';

declare module 'next-auth' {
    interface Session {
        user: UserType;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        user: UserType;
    }
}
