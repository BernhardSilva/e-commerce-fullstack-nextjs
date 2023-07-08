
import { UserButton } from "@clerk/nextjs";
export default function SetupPage() {
    return (
        <>
            <div className='p-4'>
                <p>This is a protected route!</p>
                <UserButton />
            </div>
        </>

    )
}
