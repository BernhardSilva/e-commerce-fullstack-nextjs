export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="grid place-items-center h-full w-full">
            {children}
        </div>
    );
};