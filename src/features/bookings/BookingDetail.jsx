import styled from 'styled-components';

import BookingDataBox from './BookingDataBox';

import Tag from '../../ui/Tag';
import ButtonGroup from '../../ui/ButtonGroup';

import ButtonText from '../../ui/ButtonText';

import { useMoveBack } from '../../hooks/useMoveBack';
import { useBooking } from './useBooking';
import Spinner from '../../ui/Spinner';
import { useNavigate } from 'react-router-dom';
import useCheckout from '../check-in-out/useCheckOut';
import { HiArrowUpOnSquare } from 'react-icons/hi2';
import useDeleteBooking from './useDeleteBooking';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Empty from '../../ui/Empty';

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { booking, isPending } = useBooking();
  const { checkout, isCheckingOut } = useCheckout();
  const { deleteBooking, isDeletingBooking } = useDeleteBooking();

  const moveBack = useMoveBack();
  const navigate = useNavigate();

  if (isPending) return <Spinner />;
  if (!booking) return <Empty resourceName="booking" />;

  const { status, id: bookingId, cabins } = booking;

  const statusToTagName = {
    unconfirmed: 'blue',
    'checked-in': 'green',
    'checked-out': 'silver',
  };

  return (
    <>
      <div className="row-hor">
        <HeadingGroup>
          <div className="h1">
            Booking #{bookingId} into cabin - {cabins.name}
          </div>
          <Tag status={status}>{status.replace('-', ' ')}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </div>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {status === 'unconfirmed' && (
          <button
            className="btn bg-green-500 text-white"
            onClick={() => navigate(`/checkin/${bookingId}`)}
          >
            Check in
          </button>
        )}
        {status === 'checked-in' && (
          <button
            className="btn"
            icon={<HiArrowUpOnSquare />}
            onClick={() => checkout({ bookingId })}
            disabled={isCheckingOut}
          >
            Check out
          </button>
        )}
        <Modal>
          <Modal.Open opens="delete">
            <button className="btn bg-red-500 text-white">Delete</button>
          </Modal.Open>
          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="booking"
              onConfirm={() =>
                deleteBooking(bookingId, { onSettled: () => navigate(-1) })
              }
              disabled={isDeletingBooking}
            />
          </Modal.Window>
        </Modal>

        <button className="btn bg-white text-black" onClick={moveBack}>
          Back
        </button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
