import { SignIn } from '@clerk/nextjs';

export default function Page() {
	return (
		<div className='grid-flow-row text-center'>
			You can use this email and password to sign in to the test app.
			<p>
				Mail: <b>test@einrot.com</b>
			</p>
			<p>
				Password: <b>TestP4$$w0rd</b>
			</p>
			<div className='mt-5'>
				<SignIn />
			</div>
		</div>
	);
}
