import { useState } from 'react';
import CabinTable from '../features/cabins/CabinTable';
import CreateCabinForm from '../features/cabins/CreateCabinForm';

function Cabins() {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <div className="row-hor">
        <h1 className="h1">All cabins</h1>
        <p>Filter / Sort</p>
      </div>
      <div className="row-ver">
        <CabinTable />
        <button className="btn" onClick={() => setShowForm((show) => !show)}>
          Add new cabin
        </button>
        {showForm && <CreateCabinForm />}
      </div>
    </>
  );
}

export default Cabins;
