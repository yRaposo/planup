'use client';
import OnDev from '@/components/OnDev';
import AccountList from '@/components/AccountList';

export default function Profile() {
    return (
        <div className="m-4 align-middle flex flex-col gap-2">
            <OnDev/>
            <AccountList  />
        </div>
    );
}