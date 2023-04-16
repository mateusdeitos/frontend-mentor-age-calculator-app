import {
	differenceInCalendarYears,
	differenceInCalendarMonths,
	differenceInCalendarDays,
  } from 'date-fns';
  
  interface Age {
	years: number;
	months: number;
	days: number;
  }
  
  export function calculateAge(
	birthYear: number,
	birthMonth: number,
	birthDay: number
  ): Age {
	const currentDate = new Date();
  
	let ageInYears = differenceInCalendarYears(currentDate, new Date(birthYear, birthMonth - 1, birthDay));
	let ageInMonths = differenceInCalendarMonths(currentDate, new Date(currentDate.getFullYear(), birthMonth - 1, birthDay));
	let ageInDays = differenceInCalendarDays(currentDate, new Date(currentDate.getFullYear(), currentDate.getMonth(), birthDay));


	if (ageInDays < 0) {
		ageInMonths--;
		ageInDays = 30 + ageInDays;
	}

	if (ageInMonths < 0) {
		ageInYears--;
		ageInMonths = 12 + ageInMonths;
	}
  
	return {
	  years: ageInYears,
	  months: ageInMonths,
	  days: ageInDays,
	};
  }
  