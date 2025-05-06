import supabase from './supabase';

export async function getGuestByEmail(email) {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('email', email)
    .limit(1);

  if (error) throw new Error(error.message);
  return data?.[0] || null;
}

export async function createOrGetGuest({
  fullName,
  email,
  nationality,
  nationalID,
  countryFlag,
}) {
  const { data, error } = await supabase
    .from('guests')
    .upsert([{ fullName, email, nationality, nationalID, countryFlag }], {
      onConflict: ['email'],
    }) // ключ — email
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
