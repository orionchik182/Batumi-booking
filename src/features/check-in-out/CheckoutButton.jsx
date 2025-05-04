import useCheckout from './useCheckOut';

function CheckoutButton({ bookingId }) {
  const { checkout, isCheckingOut } = useCheckout();

  return (
    <button
      className="btn btn-sm"
      onClick={() => checkout({ bookingId })}
      disabled={isCheckingOut}
    >
      Check out
    </button>
  );
}

export default CheckoutButton;
