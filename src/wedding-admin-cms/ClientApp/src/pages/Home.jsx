import React from 'react';

const Home = () => {
  return (
    <div>
      <h1>Welcome to your Wedding Portal,</h1>
      <p>where you can create your online wedding invitation, registry, about us page, and more!</p>
      <ul>
        <li><a href='/edit-wedding'>Edit Wedding</a> Click this to edit your wedding information!</li>
        <li><a href='/'>Edit Registory</a> Click this to edit your wedding registry!</li>
        <li><a href='/'>Edit About Us</a> Click this to edit your <i>About Us</i> page</li>
      </ul>
      <p>To help you get started, we have also set up:</p>
      <ul>
        <li><strong>Manage your entourage!</strong>. For example, click <em>Edit Weddings</em> to continue</li>
        <li><strong>Manage your roles in your entourage!</strong>. For example, click <em>Edit Weddings</em> to continue</li>
      </ul>
    </div>
  );
};

export default Home;