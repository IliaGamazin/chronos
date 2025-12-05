import ct from 'countries-and-timezones';

export const getUserLocale = () => {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const country = ct.getCountryForTimezone(timeZone);
    return country ? country.id.toLowerCase() : 'en';
  } catch (e) {
    return 'en';
  }
};
