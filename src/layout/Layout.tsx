import { Suspense, ReactNode } from 'react';
import { CssBaseline, Container } from '@mui/material';
import { Error, Loading, CheckForApplicationUpdate } from 'react-admin';
import { ErrorBoundary } from 'react-error-boundary';
import { useConfigurationContext } from '../root/ConfigurationContext';
import Header from './Header';

export const Layout = ({ children }: { children: ReactNode }) => {
    const { companySectors, dealCategories } = useConfigurationContext();

    return (
        <>
            <CssBaseline />
            <Header />
            <Container sx={{ maxWidth: { xl: 1280 } }}>
                <main id="main-content">
                    <ErrorBoundary FallbackComponent={Error}>
                        <Suspense fallback={<Loading />}>{children}</Suspense>
                    </ErrorBoundary>
                </main>
            </Container>
            <CheckForApplicationUpdate interval={30 * 1000} />
        </>
    );
};