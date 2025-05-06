import styled from 'styled-components';

import { formatCurrency } from '../../utils/helpers';

import CreateCabinForm from './CreateCabinForm';
import useDeleteCabin from './useDeleteCabin';
// import useCreateCabin from './useCreateCabin';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import { useNavigate } from 'react-router-dom';

import { getBookings, getBookingsByCabinId } from '../../services/apiBookings';
import useBookingsByCabinId from './useBookingsByCabinId';

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  padding: 1.4rem 2.4rem;
  background-color: ${({ $highlighted }) =>
    $highlighted ? 'lightgreen' : 'transparent'};

  cursor: pointer;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:hover {
    background-color: var(--color-grey-100);
    transition: background-color 0.2s ease;
  }
`;

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

const Price = styled.div`
  font-family: 'Sono';
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-green-700);
`;

export default function CabinRow({ cabin }) {
  const { isDeleting, deleteCabin } = useDeleteCabin();
  // const { isCreating, createCabin } = useCreateCabin();

  const navigate = useNavigate();

  const {
    id: cabinId,
    name,
    maxCapacity,
    regularPrice,
    discount,
    image,
    description,
  } = cabin;

  const { bookings } = useBookingsByCabinId(cabinId);

  const isOccupied = bookings?.some(
    (booking) => booking.status === 'checked-in',
  );

  // function handleDublicateCabin() {
  //   createCabin({
  //     name: `Copy of ${name}`,
  //     maxCapacity,
  //     regularPrice,
  //     discount,
  //     image,
  //     description,
  //   });
  // }

  return (
    <TableRow
      role="row"
      onClick={() => navigate(`/cabins/${cabinId}`)}
      $highlighted={isOccupied}
    >
      <Img src={image} />
      <Cabin>{name}</Cabin>
      <div>Fits up to {maxCapacity} guests</div>
      <Price>{formatCurrency(regularPrice)}</Price>
      {discount ? (
        <Discount>{formatCurrency(discount)}</Discount>
      ) : (
        <span>&mdash;</span>
      )}
      <div className="flex">
        {/* <button
          disabled={isCreating}
          className="btn mr-3 bg-amber-600"
          onClick={() => handleDublicateCabin()}
        >
          Copy
        </button> */}
        <Modal>
          <Modal.Open opens="edit">
            <button className="btn mr-3 bg-emerald-500">Edit</button>
          </Modal.Open>
          <Modal.Window name="edit">
            <CreateCabinForm cabinToEdit={cabin} />
          </Modal.Window>

          <Modal.Open opens="delete">
            <button className="btn" disabled={isDeleting}>
              Delete
            </button>
          </Modal.Open>
          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="cabins"
              disabled={isDeleting}
              onConfirm={() => deleteCabin(cabinId)}
            />
          </Modal.Window>
        </Modal>
      </div>
    </TableRow>
  );
}
