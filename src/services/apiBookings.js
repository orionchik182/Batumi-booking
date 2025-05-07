import { PAGE_SIZE } from '../utils/constants';
import { getToday } from '../utils/helpers';
import supabase from './supabase';

export async function getBookings({ filter, sortBy, page }) {
  let query = supabase
    .from('bookings')
    .select(
      'id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)',
      { count: 'exact' },
    );

  // FILTER
  if (filter) query = query.eq(filter.field, filter.value);

  // SORT
  if (sortBy && sortBy.field && sortBy.direction)
    console.log('sortBy:', sortBy);
  query = query.order(sortBy.field, {
    ascending: sortBy.direction === 'asc',
  });

  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error('Bookings could not be loaded');
  }
  return { data, count };
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, cabins(*), guests(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking not found');
  }

  return data;
}

export async function getBookingsByCabinId(cabinId) {
  const { data, error } = await supabase
    .from('bookings')
    .select(
      'id, status, cabinId, startDate, endDate, guests(fullName, email), cabins(name), cabinPrice, extrasPrice, totalPrice',
    )
    .eq('cabinId', cabinId);

  if (error) {
    console.error(error);
    throw new Error('Could not fetch bookings for this cabin');
  }

  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
// date: ISOString
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from('bookings')
    .select('created_at, totalPrice, extrasPrice')
    .gte('created_at', date)
    .lte('created_at', getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, guests(fullName)')
    .gte('startDate', date)
    .lte('startDate', getToday());

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const isoStart = today.toISOString();

  today.setUTCHours(23, 59, 59, 999);
  const isoEnd = today.toISOString();

  const { data, error } = await supabase
    .from('bookings')
    .select('*, guests(fullName, nationality, countryFlag)')
    .or(
      `and(status.eq.unconfirmed,startDate.gte.${isoStart},startDate.lte.${isoEnd}),` +
        `and(status.eq.checked-in,endDate.gte.${isoStart},endDate.lte.${isoEnd})`,
    )
    .order('created_at');

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }
  return data;
}

export async function createBooking(booking) {
  const { email, fullName, nationalID, nationality, countryFlag, ...rest } =
    booking;
  console.log(booking);
  const formattedBooking = {
    ...rest,
    cabinId: Number(booking.cabinId),
    cabinPrice: Number(booking.cabinPrice),
    extrasPrice: Number(booking.extrasPrice),
    totalPrice: Number(booking.totalPrice),
    numNights: Number(booking.numNights),
    numGuests: Number(booking.numGuests),
    status: booking.status || 'unconfirmed',
    isPaid: Boolean(booking.isPaid),
    hasBreakfast: Boolean(booking.hasBreakfast),
    startDate: new Date(booking.startDate).toISOString(),
    endDate: new Date(booking.endDate).toISOString(),
    observations: booking.observations || '',
    guestId: Number(booking.guestId), // ← важное!
  };

  console.log('📦 formattedBooking to insert:', formattedBooking);

  const { data, error } = await supabase
    .from('bookings')
    .insert([formattedBooking])
    .select();

  if (error) {
    console.error(error);
    throw new Error('Booking could not be created');
  }

  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from('bookings')
    .update(obj)
    .eq('id', Number(id))
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking could not be updated');
  }
  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from('bookings').delete().eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Booking could not be deleted');
  }
  return data;
}
