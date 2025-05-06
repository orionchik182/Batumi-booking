import { useQuery } from '@tanstack/react-query';

async function fetchCountryCodes() {
  const res = await fetch('https://flagcdn.com/en/codes.json');
  if (!res.ok) throw new Error('Failed to fetch country codes');
  return res.json();
}

export function useCountryFlagUrl(countryName) {
  return useQuery({
    queryKey: ['countryFlag', countryName],
    queryFn: async () => {
      const countryMap = await fetchCountryCodes();
      const code = Object.entries(countryMap).find(
        ([, name]) => name.toLowerCase() === countryName.toLowerCase()
      )?.[0];
      if (!code) throw new Error('Country not found');
      return `https://flagcdn.com/${code}.svg`;
    },
    enabled: !!countryName,
  });
}