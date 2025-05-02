import styled from 'styled-components';
import BookingDataBox from '../../features/bookings/BookingDataBox';

import ButtonGroup from '../../ui/ButtonGroup';

import ButtonText from '../../ui/ButtonText';

import { useMoveBack } from '../../hooks/useMoveBack';
import { useBooking } from '../bookings/useBooking';
import Spinner from '../../ui/Spinner';
import { useState } from 'react';
import Checkbox from '../../ui/Checkbox';
import { useEffect } from 'react';
import { formatCurrency } from '../../utils/helpers';
import useCheckin from './useCheckin';
import useSettings from '../settings/useSettings';

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const [addBreakfast, setAddBreakfast] = useState(false);
  const [confirmPaid, setConfirmPaid] = useState(false);
  const { booking, isPending } = useBooking();
  const { settings, isLoading: isLoadingSettings } = useSettings();

  useEffect(() => setConfirmPaid(booking?.isPaid ?? false), [booking]);

  const moveBack = useMoveBack();
  const { checkin, isCheckingIn } = useCheckin();

  if (isPending || isLoadingSettings) return <Spinner />;

  const {
    id: bookingId,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
  } = booking;

  const optionalBreakfastPrice =
    settings?.breakfastPrice * numNights * numGuests;

  function handleCheckin() {
    if (!confirmPaid) return;

    const updates = {
      hasBreakfast: addBreakfast, // true или false
      extrasPrice: addBreakfast ? optionalBreakfastPrice : 0,
      totalPrice: addBreakfast
        ? totalPrice + optionalBreakfastPrice
        : totalPrice,
    };

    

    checkin({
      bookingId,
      updates,
    });
  }

  return (
    <>
      <div className="row-hor">
        <div className="h1">Check in booking #{bookingId}</div>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </div>

      <BookingDataBox booking={booking} />

      {!hasBreakfast && (
        <Box>
          <Checkbox
            id="breakfast"
            checked={addBreakfast}
            onChange={() => {
              setAddBreakfast((add) => !add);
              setConfirmPaid(false);
            }}
          >
            Want to add breakfast for {formatCurrency(optionalBreakfastPrice)}?
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfirmPaid((confirm) => !confirm)}
          id="confirm"
          disabled={confirmPaid || isCheckingIn}
        >
          I confirm that {guests.fullName} has paid the total amount of{' '}
          {!addBreakfast
            ? formatCurrency(totalPrice)
            : `${formatCurrency(totalPrice + optionalBreakfastPrice)} (${formatCurrency(totalPrice)} + ${formatCurrency(optionalBreakfastPrice)})`}{' '}
          for {numNights} night stay.
        </Checkbox>
      </Box>

      <ButtonGroup>
        <button
          className="btn"
          onClick={handleCheckin}
          disabled={!confirmPaid || isCheckingIn}
        >
          Check in booking #{bookingId}
        </button>
        <button className="btn bg-white text-black" onClick={moveBack}>
          Back
        </button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
