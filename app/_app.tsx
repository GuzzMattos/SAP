import { scheduleCdiUpdate } from '@/lib/cron';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import '@/app/tasks/monthlyTask';

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        scheduleCdiUpdate();
    }, []);

    return <Component {...pageProps} />;
}

export default MyApp;
