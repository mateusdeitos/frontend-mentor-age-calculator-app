import { animateOpacity } from "./animation";
import { dayInput, dayResult, form, monthInput, monthResult, result, yearInput, yearResult } from "./components";
import { calculateAge } from "./logic";

type FormData = {
	day: number;
	month: number;
	year: number;
}

export function setupEvents() {
	setupFormEvents();
}

function setupFormEvents() {
	form.addEventListener("submit", validateForm(({ day, month, year }) => {
		const { years, months, days } = calculateAge(year, month, day);

		showResults(years, months, days);
	}));

	[dayInput, monthInput, yearInput].forEach(input => {
		input.addEventListener("keydown", e => {
			if (e.key === "Enter") {
				form.dispatchEvent(new Event("submit"));
			}
		})
	})
}

const validateForm = (callback: (data: FormData) => void) => function (e: SubmitEvent) {
	e.preventDefault();
	try {
		const formData = new FormData(e.target as HTMLFormElement);
		const day = parseStringValueToInt(formData.get("day"));
		const month = parseStringValueToInt(formData.get("month"));
		const year = parseStringValueToInt(formData.get("year"));
		validateEmpty(day, month, year);
		const someIsEmpty = day === undefined || month === undefined || year === undefined;
		if (someIsEmpty) {
			throw new Error("Empty fields");
		}

		validateDate(day, month, year);
		callback({ day, month, year });
	} catch (error) {

	}
}

const validateEmpty = (
	day: number | undefined,
	month: number | undefined,
	year: number | undefined
) => {
	const hasErrors = ([
		[day, "day"],
		[month, "month"],
		[year, "year"]
	] as const).some(([value, id]) => {
		removeError(id);
		if (value === undefined) {
			addError(id, "this field is required");
		}
	});

	if (hasErrors) {
		return false;
	}

	return true;
}

const addError = (id: "day" | "month" | "year", message: string) => {
	const element = document.querySelector(`.text-error.${id}`);
	if (element) {
		element.textContent = message;
		element.classList.remove("hide");
	}
}

const removeError = (id: "day" | "month" | "year") => {
	const element = document.querySelector(`.text-error.${id}`);
	if (element) {
		element.classList.add("hide");
		element.textContent = "";
	}
}

const validateDate = (day: number, month: number, year: number) => {
	const date = new Date(year, month - 1, day);
	const currentDate = new Date();
	if (date > currentDate) {
		[dayInput, monthInput, yearInput].forEach(input => {
			addError(input.id as "day" | "month" | "year", "Invalid date");
		})
		throw new Error("Invalid date");
	}

	const hasErrors = ([
		["day", day, date.getDate()],
		["month", month, date.getMonth() + 1],
		["year", year, date.getFullYear()],
	] as const).some(([id, actual, expected]) => {
		removeError(id);
		if (actual !== expected) {
			addError(id, "Invalid value");
			return true;
		}
		return false;
	});

	if (hasErrors) {
		throw new Error("Invalid date");
	}

}

const parseStringValueToInt = (string: any): number | undefined => {
	if (typeof string === "number") {
		return string;
	}

	if (typeof string === "string") {
		const parsed = parseInt(string, 10);
		if (!Number.isNaN(parsed)) {
			return parsed;
		}
	}

	return undefined;
}

function showResults(years: number, months: number, days: number) {
	animateOpacity(result.item(0), () => {
		[
			{ value: years, element: yearResult },
			{ value: months, element: monthResult },
			{ value: days, element: dayResult },
		].forEach(({ value, element }) => {
			const span = Array.from(element.childNodes)
				.find(node => node instanceof HTMLSpanElement && node.classList.contains("value"))
			if (span) {
				span.textContent = value.toString();
			}
		});
	});
} 