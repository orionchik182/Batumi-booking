import styled from 'styled-components';

const StyledTag = styled.span`
  width: fit-content;
  text-transform: uppercase;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.4rem 1.2rem;
  border-radius: 100px;
`;

const statusClassMap = {
  unconfirmed: 'bg-blue-100 text-blue-700',
  'checked-in': 'bg-green-100 text-green-700',
  'checked-out': 'bg-yellow-100 text-yellow-700',
};

export default function Tag({ status, children }) {
  return (
    <StyledTag className={`${statusClassMap[status]}`}>
      {children}
    </StyledTag>
  );
}
