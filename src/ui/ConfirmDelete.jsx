import styled from 'styled-components';
import Button from './Button';

const StyledConfirmDelete = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

function ConfirmDelete({ resourceName, onConfirm, disabled, onCloseModal }) {
  return (
    <StyledConfirmDelete>
      <div className="h3">Delete {resourceName}</div>
      <p>
        Are you sure you want to delete this {resourceName} permanently? This
        action cannot be undone.
      </p>

      <div>
        <button
          className="btn bg-gray-50 text-black"
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancel
        </button>
        <button
          className="btn bg-red-700"
          disabled={disabled}
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </StyledConfirmDelete>
  );
}

export default ConfirmDelete;
