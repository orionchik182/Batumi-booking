import Modal from '../../ui/Modal';

import CreateBookingForm from './CreateBookingForm';

export default function AddBooking() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="cabin-form">
          <button className="btn">Add new booking</button>
        </Modal.Open>
        <Modal.Window name="cabin-form">
          <CreateBookingForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}
