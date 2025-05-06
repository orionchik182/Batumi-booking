import BookingTable from '../features/bookings/BookingTable';
import BookingTableOperations from '../features/bookings/BookingTableOperations';
import { useBookings } from '../features/bookings/useBookings';
import Pagination from '../ui/Pagination';
import Table from '../ui/Table';

function Bookings() {
  const { isPending, bookings, count } = useBookings();
  return (
    <>
      <div className="row-hor">
        <h1 className="h1">All bookings</h1>
        <BookingTableOperations />
      </div>

      <BookingTable isPending={isPending} bookings={bookings}>
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </BookingTable>
    </>
  );
}

export default Bookings;
