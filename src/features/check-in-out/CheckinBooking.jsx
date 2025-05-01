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

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const [confirmPaid, setConfirmPaid] = useState(false);
  const { booking, isPending } = useBooking();

  useEffect(() => setConfirmPaid(booking?.isPaid ?? false), [booking]);

  const moveBack = useMoveBack();
  const {checkin, isCheckingIn} = useCheckin();

  if (isPending) return <Spinner />;

  const {
    id: bookingId,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
  } = booking;

  function handleCheckin() {
    if (!confirmPaid) return;
    checkin(bookingId);
  }

  return (
    <>
      <div className="row-hor">
        <div className="h1">Check in booking #{bookingId}</div>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </div>

      <BookingDataBox booking={booking} />

      <Box>
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfirmPaid((confirm) => !confirm)}
          id="confirm"
          disabled={confirmPaid || isCheckingIn}
        >
          I confirm that {guests.fullName} has paid the total amount of{' '}
          {formatCurrency(totalPrice)}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <button className="btn" onClick={handleCheckin} disabled={!confirmPaid || isCheckingIn}>
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
