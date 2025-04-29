import BookingTable from "../features/bookings/BookingTable";
import BookingTableOperations from "../features/bookings/BookingTableOperations";

function Bookings() {
  return (
    <>
    <div className="row-hor">
      <h1 className="h1">All bookings</h1>
      <BookingTableOperations />
    </div>

    <BookingTable />
    </>
  );
}

export default Bookings;
