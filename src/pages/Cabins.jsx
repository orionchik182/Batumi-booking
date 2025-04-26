import CabinTable from '../features/cabins/CabinTable';

import AddCabin from '../features/cabins/AddCabin';
import CabinTableOperations from '../features/cabins/CabinTableOperations';

function Cabins() {
  return (
    <>
      <div className="row-hor">
        <h1 className="h1">All cabins</h1>
        <CabinTableOperations />
      </div>
      <div className="row-ver">
        <CabinTable />
        <AddCabin />
      </div>
    </>
  );
}

export default Cabins;
