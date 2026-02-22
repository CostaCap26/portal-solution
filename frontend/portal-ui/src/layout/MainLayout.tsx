import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function MainLayout({ children }: Props) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="bg-white shadow p-4">
                <h1 className="text-xl font-semibold">DataPortal</h1>
            </header>

            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    );
}