import React from 'react';
import { Table } from 'reactstrap';

const WeddingTable = ({ weddings }) => {
  return (
    <Table responsive hover striped>
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
        {
          weddings.map(wedding => (
            <tr key={wedding?.weddingId}>
              <td>{wedding?.bride}</td>
              <td>{wedding?.groom}</td>
              <td>{wedding?.ceremonyDate ? new Date(wedding.ceremonyDate).toLocaleString('en-US') : null}</td>
              <td>{wedding?.ceremonyLocation}</td>
              <td>{wedding?.receptionDate ? new Date(wedding.receptionDate).toLocaleString('en-US') : null}</td>
              <td>{wedding?.receptionLocation}</td>
            </tr>
          ))
        }
      </tbody>
    </Table>
  );
};

export default WeddingTable;