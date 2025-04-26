import CabinTable from '../features/cabins/CabinTable';

import AddCabin from '../features/cabins/AddCabin';

function Cabins() {
  return (
    <>
      <div className="row-hor">
        <h1 className="h1">All cabins</h1>
        <p>Filter / Sort</p>
      </div>
      <div className="row-ver">
        <CabinTable />
        <AddCabin />
      </div>
    </>
  );
}

export default Cabins;
