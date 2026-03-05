'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton({
    className,
    children,
    title,
}: {
    className?: string;
    children: React.ReactNode;
    title?: string;
}) {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className={className}
            title={title}
        >
            {children}
        </button>
    );
}
