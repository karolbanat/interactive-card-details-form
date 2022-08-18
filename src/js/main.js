let detailsCard;
let detailsFront, detailsBack;
let cardholderInput, cardholderOutput;
let cardNumberInput, cardNumberOutput;
let expirationMonthInput, expirationMonthOutput;
let expirationYearInput, expirationYearOutput;
let cvcNumberInput, cvcNumberOutput;
let submitBtn, continueBtn;

/* defaults for reseting information on outputs */
const DEFAULT_CARDHOLDER = 'Jane appleseed';
const DEFAULT_CARD_NUMBER = '0000 0000 0000 0000';
const DEFAULT_EXPIRATION_MONTH = '00';
const DEFAULT_EXPIRATION_YEAR = '00';
const DEFAULT_CVC = '000';

const main = () => {
	prepareDOMElements();
	prepareDOMEvents();
};

const prepareDOMElements = () => {
	detailsCard = document.querySelector('.details');
	detailsFront = detailsCard.querySelector('[data-side=front]');
	detailsBack = detailsCard.querySelector('[data-side=back]');

	/* inputs and outputs */
	cardholderInput = document.querySelector('#cardholder-name');
	cardholderOutput = document.querySelector('#cardholder-name-output');
	cardNumberInput = document.querySelector('#card-number');
	cardNumberOutput = document.querySelector('#card-number-output');
	expirationMonthInput = document.querySelector('#expiration-month');
	expirationMonthOutput = document.querySelector('#expiration-month-output');
	expirationYearInput = document.querySelector('#expiration-year');
	expirationYearOutput = document.querySelector('#expiration-year-output');
	cvcNumberInput = document.querySelector('#card-cvc');
	cvcNumberOutput = document.querySelector('#card-cvc-output');

	/* buttons */
	submitBtn = document.querySelector('#details-submit-button');
	continueBtn = document.querySelector('#confirmation-button');
};

const prepareDOMEvents = () => {
	/* cardholder input */
	cardholderInput.addEventListener('input', handleCardholderName);
	cardholderInput.addEventListener('focusout', handleCardholderName);

	/* card number input */
	cardNumberInput.addEventListener('input', handleCardNumber);
	cardNumberInput.addEventListener('focusout', handleCardNumber);

	/* expiration inputs */
	expirationMonthInput.addEventListener('input', handleExpirationMonth);
	expirationMonthInput.addEventListener('focusout', handleExpirationMonth);

	expirationYearInput.addEventListener('input', handleExpirationYear);
	expirationYearInput.addEventListener('focusout', handleExpirationYear);

	/* CVC input */
	cvcNumberInput.addEventListener('input', handleCVCNumber);
	cvcNumberInput.addEventListener('focusout', handleCVCNumber);

	/* buttons */
	submitBtn.addEventListener('click', handleSubmitBtn);
	continueBtn.addEventListener('click', handleContinueBtn);
};

/* cardholder input handling */
const handleCardholderName = (e) => {
	const input = e.target;
	const value = input.value;
	const { isValid, errorMsg } = validateCardholderName(value);

	if (!isValid) showErrorMessage(input, errorMsg);
	else clearError(input);

	insertOutput(cardholderOutput, value);
};

const validateCardholderName = (value) => {
	const trimmed = value.trim();
	const isBlank = checkBlank(trimmed);

	if (isBlank) return { isValid: false, errorMsg: "Can't be blank" };
	else return { isValid: true, errorMsg: '' };
};

const checkBlank = (value) => {
	return value === '';
};

/* card number input handling */
const handleCardNumber = (e) => {
	const input = e.target;
	const value = removeSpaces(input.value);
	const { isValid, errorMsg } = validateCardNumber(value);
	input.value = groupCardNumber(value, 4);

	if (!isValid) showErrorMessage(input, errorMsg);
	else clearError(input);

	insertOutput(cardNumberOutput, formatCardNumber(value));
};

const validateCardNumber = (value) => {
	const withoutSpaces = removeSpaces(value);
	const isBlank = checkBlank(withoutSpaces);
	const isValidated = /^[^\D]+$/.test(withoutSpaces);
	const isLongEnough = withoutSpaces.length === 16;

	if (isBlank) return { isValid: false, errorMsg: "Can't be blank" };
	else if (!isValidated) return { isValid: false, errorMsg: 'Wrong format, numbers only' };
	else if (!isLongEnough) return { isValid: false, errorMsg: 'Too short' };
	else return { isValid: true, errorMsg: '' };
};

const formatCardNumber = (cardNumber) => {
	const withoutSpaces = removeSpaces(cardNumber);
	const padded = withoutSpaces.padEnd(16, '0');
	return groupCardNumber(padded, 4);
};

const groupCardNumber = (value, itemsInGroup) => {
	const groups = [];
	for (let i = 0; i < value.length; i += itemsInGroup) groups.push(value.slice(i, i + itemsInGroup));
	return groups.join(' ');
};

const removeSpaces = (value) => {
	return value.replace(/\s/g, '');
};

/* expiration date handling */
const handleExpirationMonth = (e) => {
	const input = e.target;
	const value = input.value.trim();
	const { isValid, errorMsg } = validateExpiration(value, validateExpirationMonth);

	if (!isValid) showErrorMessage(input, errorMsg);
	else clearError(input);

	insertOutput(expirationMonthOutput, value);
};

const handleExpirationYear = (e) => {
	const input = e.target;
	const value = input.value.trim();
	const { isValid, errorMsg } = validateExpiration(value, validateExpirationYear);

	if (!isValid) showErrorMessage(input, errorMsg);
	else clearError(input);

	insertOutput(expirationYearOutput, value);
};

const validateExpiration = (value, validator) => {
	const trimmed = value.trim();
	const isBlank = checkBlank(trimmed);
	const isValidated = validator(trimmed);

	if (isBlank) return { isValid: false, errorMsg: "Can't be blank" };
	else if (!isValidated) return { isValid: false, errorMsg: 'Wrong format' };
	else return { isValid: true, errorMsg: '' };
};

const validateExpirationMonth = (value) => {
	return /^0[1-9]$|^1[0-2]$/.test(value);
};

const validateExpirationYear = (value) => {
	return /^\d{2}$/.test(value);
};

/* CVC input handling */
const handleCVCNumber = (e) => {
	const input = e.target;
	const value = input.value;
	const { isValid, errorMsg } = validateCVC(value);

	if (!isValid) showErrorMessage(input, errorMsg);
	else clearError(input);

	insertOutput(cvcNumberOutput, value);
};

const validateCVC = (value) => {
	const trimmed = value.trim();
	const isBlank = checkBlank(trimmed);
	const isValidated = /^\d{3}$/.test(trimmed);

	if (isBlank) return { isValid: false, errorMsg: "Can't be blank" };
	else if (!isValidated) return { isValid: false, errorMsg: 'Wrong format' };
	else return { isValid: true, errorMsg: '' };
};

/* output inserting */
const insertOutput = (output, value) => {
	output.innerText = value;
};

/* error handling */
const showErrorMessage = (input, message) => {
	const error = input.closest('.details-form__input-container').querySelector('.details-form__error');
	error.innerText = message;
	input.classList.add('error');
};

const clearError = (input) => {
	showErrorMessage(input, '');
	input.classList.remove('error');
};

/* buttons handling */
const handleSubmitBtn = (e) => {
	e.preventDefault();
	const { isValid: isNameValid, errorMsg: nameError } = validateCardholderName(cardNumberInput.value);
	const { isValid: isCardNumberValid, errorMsg: cardNumberError } = validateCardNumber(cardNumberInput.value);
	const { isValid: isExpirationMonthValid, errorMsg: expMonthError } = validateExpiration(
		expirationMonthInput.value,
		validateExpirationMonth
	);
	const { isValid: isExpirationYearValid, errorMsg: expYearError } = validateExpiration(
		expirationYearInput.value,
		validateExpirationYear
	);
	const { isValid: isCVCValid, errorMsg: cvcError } = validateCVC(cvcNumberInput.value);

	/* check if all are valid */
	const isValid = isNameValid && isCardNumberValid && isExpirationMonthValid && isExpirationYearValid && isCVCValid;
	if (isValid) showConfirmation();

	/* add errors to invalid input fields */
	if (!isNameValid) showErrorMessage(cardholderInput, nameError);
	if (!isCardNumberValid) showErrorMessage(cardNumberInput, cardNumberError);
	if (!isExpirationMonthValid) showErrorMessage(expirationMonthInput, expMonthError);
	if (!isExpirationYearValid) showErrorMessage(expirationYearInput, expYearError);
	if (!isCVCValid) showErrorMessage(cvcNumberInput, cvcError);
};

const showConfirmation = () => {
	detailsFront.classList.add('animation-flip-out');
	setTimeout(() => {
		detailsFront.classList.remove('animation-flip-out');
		detailsFront.classList.add('hidden');
		detailsBack.classList.add('animation-flip-in');
		detailsBack.classList.remove('hidden');
	}, 900);
	setTimeout(() => {
		detailsBack.classList.remove('animation-flip-in');
	}, 1800);
};

const handleContinueBtn = (e) => {
	detailsCard.removeAttribute('data-completed');
	detailsFront.classList.remove('hidden');
	detailsBack.classList.add('hidden');
	clearInputs();
	clearOutputs();
};

const clearInputs = () => {
	cardholderInput.value = '';
	cardNumberInput.value = '';
	expirationMonthInput.value = '';
	expirationYearInput.value = '';
	cvcNumberInput.value = '';
};

const clearOutputs = () => {
	cardholderOutput.innerText = DEFAULT_CARDHOLDER;
	cardNumberOutput.innerText = DEFAULT_CARD_NUMBER;
	expirationMonthOutput.innerText = DEFAULT_EXPIRATION_MONTH;
	expirationYearOutput.innerText = DEFAULT_EXPIRATION_YEAR;
	cvcNumberOutput.innerText = DEFAULT_CVC;
};

document.addEventListener('DOMContentLoaded', main);
