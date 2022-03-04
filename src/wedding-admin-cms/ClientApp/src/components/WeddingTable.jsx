import React from 'react';

const WeddingTable = ({ wedding }) => {
  return (
    <table className='table table-striped' aria-labelledby="tabelLabel">
      <thead>
        <tr>
          <th>Bride</th>
          <th>Groom</th>
          <th>Cermoney Date</th>
          <th>Ceremony Location</th>
          <th>Reception Date</th>
          <th>Reception Location</th>
        </tr>
      </thead>
      <tbody>
        <tr key={wedding?.weddingId}>
          <td>{wedding?.bride}</td>
          <td>{wedding?.groom}</td>
          <td>{wedding?.ceremonyDate ? new Date(wedding.ceremonyDate).toLocaleString('en-US') : null}</td>
          <td>{wedding?.ceremonyLocation}</td>
          <td>{wedding?.receptionDate ? new Date(wedding.receptionDate).toLocaleString('en-US') : null}</td>
          <td>{wedding?.receptionLocation}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default WeddingTable;