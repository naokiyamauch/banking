'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { signIn, signUp } from '@/lib/actions/user.actions';
import { authFormSchema } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import CustomInput from './CustomInput';
import PlaidLink from './PlaidLink';
const AuthForm = ({ type }: { type: string }) => {
	const router = useRouter();
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const formSchema = authFormSchema(type);

	// Define form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
			firstName: '',
			lastName: '',
			address1: '',
			city: '',
			state: '',
			postalCode: '',
			dateOfBirth: '',
			ssn: '',
		},
	});

	// 2. Define a submit handler.
	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		try {
			const userData = {
				firstName: data.firstName!,
				lastName: data.lastName!,
				address1: data.address1!,
				city: data.city!,
				state: data.state!,
				postalCode: data.postalCode!,
				dateOfBirth: data.dateOfBirth!,
				ssn: data.ssn!,
				email: data.email!,
				password: data.password!,
			};

			// Sign up with Appwrite & create plain link token

			if (type === 'sign-up') {
				const newUser = await signUp(userData);
				setUser(newUser);
			}
			if (type === 'sign-in') {
				const response = await signIn({
					email: data.email,
					password: data.password,
				});
				if (response) router.push('/');
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className="auth-form">
			<header className="flex flex-col gap-5 md:gap-8">
				<Link
					href="/"
					className="cursor-pointer flex items-center gap-1"
				>
					<Image
						src="/icons/logo.svg"
						width={34}
						height={34}
						alt="Horizon logo"
					/>
					<h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
						Horizon
					</h1>
				</Link>

				<div className="flex flex-col gap-1 md:gap-3">
					<h1 className="text-24 lg:text-36 font-semibold text-gray-900">
						{user
							? 'Link Account'
							: type === 'sign-in'
							? 'Sign In'
							: 'Sign Up'}
						<p className="text-16 font-normal text-gray-600">
							{user
								? 'Link your account to get started'
								: 'Please enter your details'}
						</p>
					</h1>
				</div>
			</header>

			{user ? (
				<div className="flex flex-col gap-4">
					<PlaidLink user={user} variant="primary" />
				</div>
			) : (
				<>
					{' '}
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-8"
						>
							{type === 'sign-up' && (
								<>
									<div className="flex gap-4">
										<div className="flex-1">
											<CustomInput
												control={form.control}
												name="firstName"
												label="First Name"
												placeholder="ex: John"
											/>
										</div>
										<div className="flex-1">
											<CustomInput
												control={form.control}
												name="lastName"
												label="Last Name"
												placeholder="ex: Smith"
											/>
										</div>
									</div>
									<CustomInput
										control={form.control}
										name="address1"
										label="Address"
										placeholder="Enter your specific address"
									/>
									<CustomInput
										control={form.control}
										name="city"
										label="City"
										placeholder="Enter your city"
									/>
									<div className="flex gap-4">
										<div className="flex-1">
											<CustomInput
												control={form.control}
												name="state"
												label="State"
												placeholder="ex: NY"
											/>
										</div>
										<div className="flex-1">
											<CustomInput
												control={form.control}
												name="postalCode"
												label="Postal Code"
												placeholder="ex: 11101"
											/>
										</div>
									</div>
									<div className="flex gap-4">
										<div className="flex-1">
											<CustomInput
												control={form.control}
												name="dateOfBirth"
												label="Date of Birth"
												placeholder="YYYY-MM-DD"
											/>
										</div>
										<div className="flex-1">
											<CustomInput
												control={form.control}
												name="ssn"
												label="SSN"
												placeholder="ex: 123-45-678"
											/>
										</div>
									</div>
								</>
							)}
							<CustomInput
								control={form.control}
								name="email"
								label="Email"
								placeholder="Enter your email"
							/>

							<CustomInput
								control={form.control}
								name="password"
								label="Password"
								placeholder="Enter your password"
							/>

							<div className="flex flex-col gap-4">
								<Button
									type="submit"
									disabled={isLoading}
									className="form-btn"
								>
									{isLoading ? (
										<>
											<Loader2
												size={20}
												className="animate-spin"
											/>{' '}
											&nbsp; Loading...
										</>
									) : type === 'sign-in' ? (
										'Sign In'
									) : (
										'Sign Up'
									)}
								</Button>
							</div>
						</form>
					</Form>
					<footer className="flex justify-center gap-1">
						<p className="text-14 font-normal text-gray-500">
							{type === 'sign-in'
								? "Don't have an account?"
								: 'Already have an account?'}
						</p>
						<Link
							href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
							className="form-link"
						>
							{type === 'sign-in' ? 'Sign Up' : 'Sign In'}
						</Link>
					</footer>
				</>
			)}
		</section>
	);
};

export default AuthForm;
