import * as yup from "yup";
import styles from "./App.module.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRef } from 'react';

const fieldsScheme = yup.object().shape({
	email: yup
		.string()
		.matches(
			/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/,
			'Некорректный адрес электронной почты. Допустимы латинские буквы, цифры, "_", "-", "@", точки',
		)
		.required(),
	password: yup
		.string()
		.max(25, "Должно быть меньше 25 символов")
		.min(6, "Пароль должен содержать минимум 6 символов")
		.matches(
			/[A-Z]/ && /[a-z]/ && /\d/ && /[!@#$%^&*(),.?":{}|<>]/,
			"Пароль должен содержать как минимум одну заглавную, строчную, цифру и спецсимвол",
		)
		.required(),
	repeatPassword: yup
		.string()
		.oneOf([yup.ref("password"), null], "Пароли должны совпадать")
		.required(),
});

export function App2() {
	// const emailRef = useRef();
	// const passwordRef = useRef();
	// const repeatPasswordRef = useRef();
	const submitButtonRef = useRef(null);

	const {
		register,
		handleSubmit,
		setFocus,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: "",
			password: "",
			repeatPassword: "",
		},
		resolver: yupResolver(fieldsScheme),
	});


	const emailError = errors.email?.message;
	const passwordError = errors.password?.message;
	const repeatPasswordError = errors.repeatPassword?.message;

	const onSubmit = (formData) => {
		// if (!!emailError && !!passwordError && !!repeatPasswordError) submitButtonRef.current?.focus();
		console.log(formData);
	};

	const handleReset = () => {
		reset({
			email: "",
			password: "",
			repeatPassword: "",
		});
		// setFocus('email')
	}

	return (
		<div className={styles.app}>
			<h4>Приложение с использованием React Hook Form и Yup</h4>
			<form onSubmit={handleSubmit(onSubmit)}>
				<input
				name="email"
				type="email"
				placeholder="Email" {...register("email")}
				// ref={emailRef}
				/>
				<input
					name="password"
					type="password"
					placeholder="Пароль"
					{...register("password")}
					// ref={passwordRef}
				/>
				<input
					name="repeatPassword"
					type="password"
					placeholder="Повторите пароль"
					{...register("repeatPassword")}
					// ref={repeatPasswordRef}
				/>
				<button
					ref={submitButtonRef}
					type="submit"
					disabled={!!emailError && !!passwordError && !!repeatPasswordError}

				>
					Зарегистрироваться
				</button>
				<button type="button" onClick={handleReset}>
					Сбросить
				</button>
			</form>
			{emailError && <div className={styles.error}>{emailError}</div>}
			{passwordError && <div className={styles.error}>{passwordError}</div>}
			{repeatPasswordError && <div className={styles.error}>{repeatPasswordError}</div>}
		</div>
	);
}
