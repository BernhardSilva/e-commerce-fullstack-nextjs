import Image from 'next/image';
import logo from '../../public/logo.png';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<div
				className='flex h-screen w-full items-center justify-center bg-gray-900 bg-cover bg-no-repeat'
				style={{
					backgroundImage: `url('/auth-bg.avif')`
				}}
			>
				<div className='rounded-xl bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8'>
					<div className='text-white'>
						<div className='mb-8 flex flex-col items-center'>
							<div className='rounded-xl p-3'>
								<Image src={logo} height={350} width={350} alt='' />
							</div>
						</div>
						{children}
					</div>
				</div>
			</div>
		</>
	);
}
