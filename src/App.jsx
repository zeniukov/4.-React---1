import { useState, useRef } from "react";
import styles from "./App.module.css";

const sendData = (formData) => {
	console.log(formData);
};

const initialState = {
	email: "",
	password: "",
	repeatPassword: "",
};

const errorsState = {
	emailError: "",
	passwordError: "",
	repeatPasswordError: "",
};

const errorsList = {
	emailIncorrect:
		'Некорректный адрес электронной почты. Допустимы латинские буквы, цифры, "_", "-", "@", точки',
	passwordIncorrect:
		"Пароль должен содержать минимум 6 символов, включая заглавную, строчную, цифру и спецсимвол",
	repeatPasswordIncorrect: "Пароли должны совпадать",
	emptyField: "Поле не должно быть пустым",
};

const useStore = () => {
	const [state, setState] = useState(initialState);
	const [errors, setErrors] = useState(errorsState);
	const [fieldTouched, setFieldTouched] = useState({
		email: false,
		password: false,
		repeatPassword: false,
	});

	const isEmailCorrect = (value) => /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(value);

	const isPasswordCorrect = (value) => {
		const valueCopy = value.trim();
		return (
			valueCopy.length >= 6 &&
			/[A-Z]/.test(valueCopy) &&
			/[a-z]/.test(valueCopy) &&
			/\d/.test(valueCopy) &&
			/[!@#$%^&*(),.?":{}|<>]/.test(valueCopy)
		);
	};

	const returnError = (name, error) =>
		setErrors((prev) => ({ ...prev, [`${name}Error`]: error }));

	return {
		getState: () => state,
		handleChange: (name, value) => {
			setState((prev) => ({ ...prev, [name]: value }));

			if (!fieldTouched[name]) return;

			if (name === "email")
				returnError(
					name,
					value && !isEmailCorrect(value) ? errorsList.emailIncorrect : "",
				);
			if (name === "password")
				returnError(
					name,
					value && !isPasswordCorrect(value) ? errorsList.passwordIncorrect : "",
				);
			// if (name === "password" && state.repeatPassword)
			// 	returnError(
			// 		name,
			// 		state.repeatPassword !== value ? errorsList.repeatPasswordIncorrect : "",
				// );
			if (name === "repeatPassword")
				returnError(
					name,
					value !== state.password ? errorsList.repeatPasswordIncorrect : "",
				);
		},
		getError: () => errors,
		handleBlur: (name, value) => {
			if (!value.trim()) return returnError(name, errorsList.emptyField);

			if (name === "email" && !isEmailCorrect(value))
				returnError(name, errorsList.emailIncorrect);
			if (name === "password" && !isPasswordCorrect(value))
				returnError(name, errorsList.passwordIncorrect);
			if (name === "repeatPassword" && value !== state.password)
				returnError(name, errorsList.repeatPasswordIncorrect);

			setFieldTouched((rest) => ({ ...rest, [name]: true }));
		},
		resetState: () => {
			setState(initialState);
			setErrors(errorsState);
			setFieldTouched({
				email: false,
				password: false,
				repeatPassword: false,
			});
		},
	};
};

export function App() {
	const { getState, handleChange, getError, handleBlur, resetState } = useStore();

	const submitButtonRef = useRef(null);

	const { email, password, repeatPassword } = getState();
	const { emailError, passwordError, repeatPasswordError } = getError();

	const isFormValid =
		email &&
		password &&
		repeatPassword &&
		password === repeatPassword &&
		!emailError &&
		!passwordError &&
		!repeatPasswordError;

	const onChange = ({ target }) => {
		handleChange(target.name, target.value);
		if (isFormValid) submitButtonRef.current?.focus();
	};

	const onBlur = ({ target }) => {
		handleBlur(target.name, target.value);
	};

	const onSubmit = (event) => {
		event.preventDefault();
		sendData(getState());
	};

	return (
		<div className={styles.app}>
			<h4>Приложение на базе Vite</h4>
			<form onSubmit={onSubmit}>
				<input
					type="email"
					name="email"
					placeholder="Email"
					value={email}
					onChange={onChange}
					onBlur={onBlur}
				/>

				<input
					type="password"
					name="password"
					placeholder="Пароль"
					value={password}
					onChange={onChange}
					onBlur={onBlur}
				/>

				<input
					type="password"
					name="repeatPassword"
					placeholder="Повторите пароль"
					value={repeatPassword}
					onChange={onChange}
					onBlur={onBlur}
				/>

				<button
					ref={submitButtonRef}
					type="submit"
					disabled={!isFormValid}
				>
					Зарегистрироваться
				</button>

				<button type="button" onClick={resetState}>
					Сбросить
				</button>
			</form>
			{emailError && <div className={styles.error}>{emailError}</div>}
			{passwordError && <div className={styles.error}>{passwordError}</div>}
			{repeatPasswordError && <div className={styles.error}>{repeatPasswordError}</div>}
		</div>
	);
}
