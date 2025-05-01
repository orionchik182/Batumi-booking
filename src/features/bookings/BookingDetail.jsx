import styled from 'styled-components';

import BookingDataBox from './BookingDataBox';

import Tag from '../../ui/Tag';
import ButtonGroup from '../../ui/ButtonGroup';

import ButtonText from '../../ui/ButtonText';

import { useMoveBack } from '../../hooks/useMoveBack';
import { useBooking } from './useBooking';
import Spinner from '../../ui/Spinner';
import { useNavigate } from 'react-router-dom';

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { booking, isPending } = useBooking();

  const moveBack = useMoveBack();
  const navigate = useNavigate();

  if (isPending) return <Spinner />;

  const { status, id: bookingId } = booking;

  const statusToTagName = {
    unconfirmed: 'blue',
    'checked-in': 'green',
    'checked-out': 'silver',
  };

  return (
    <>
      <div className="row-hor">
        <HeadingGroup>
          <div className="h1">Booking #{bookingId}</div>
          <Tag type={statusToTagName[status]}>{status.replace('-', ' ')}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </div>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {status === 'unconfirmed' && (
                      <button 
                        className='btn bg-green-500 text-white'
                        onClick={() => navigate(`/checkin/${bookingId}`)}
                      >
                        Check in
                      </button>
                    )}
        <button className="btn bg-white text-black" onClick={moveBack}>
          Back
        </button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
