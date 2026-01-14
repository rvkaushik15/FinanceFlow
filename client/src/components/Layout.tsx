import React from 'react';
import Sidebar from './Sidebar';
import MouseSpotlight from './MouseSpotlight';
import PageTransition from './PageTransition';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex min-h-screen relative overflow-hidden bg-dark-bg text-silver-200 selection:bg-gold-500/30">
            <MouseSpotlight />

            {/* Dynamic Background Elements */}
            <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gold-600/5 rounded-full blur-[120px] pointer-events-none animate-shimmer" />
            <div className="fixed bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-silver-500/5 rounded-full blur-[100px] pointer-events-none" />

            <Sidebar />

            <main className="flex-1 ml-64 relative z-10 w-[calc(100%-16rem)] max-w-[calc(100%-16rem)]">
                <div className="p-8 max-w-7xl mx-auto pb-20">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </div>
            </main>
        </div>
    );
};

export default Layout;
