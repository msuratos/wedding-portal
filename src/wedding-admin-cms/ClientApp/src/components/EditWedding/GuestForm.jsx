import React, { useState } from 'react';
import { Button, Col, Form, FormGroup, FormText, Input, Label } from 'reactstrap';

const GuestForm = () => {
  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.files[0];
    setInputs({ name, value });
  };

  const formSubmit = (e) => {
    const data = new FormData();
    data.append(inputs.name, inputs.value);

    console.log(inputs, data);
    //e.preventDefault();
  };

  return (
    <>
      <Form encType="multipart/form-data" action="/api/Guest" method="post" style={{ padding: '15px' }}>
        <FormGroup row>
          <Label for="file" sm={2}>File</Label>
          <Col sm={10}>
            <Input id="file" name="file" type="file" onChange={handleChange} />
            <FormText>Please upload .xlsx or .xls files with the correct format in order to process properly</FormText>
          </Col>
        </FormGroup>
        <FormGroup>
          <Button color="primary" type="submit" style={{ width: '100%' }}>Upload</Button>
        </FormGroup>
      </Form>
    </>
  );
};

export default GuestForm;