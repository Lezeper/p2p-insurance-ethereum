import React, { Component } from 'react';
import { Select } from 'semantic-ui-react';

export default class UserComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [{
        text: '0x5A9F7',
        value: '0x5A9F75d0899787dD6787E5F697236256a4F2B783'
      }, {
        text: '0x0d09D',
        value: '0x0d09DaAa944060056d35988Ba3C045E53530cdAd'
      }, {
        text: '0xFf821',
        value: '0xFf821b2c22d6B62Ca169dB708E408A20bCae19aC'
      }],
      selectedUser: ''
    }
  }

  selectUser(data) {
    this.setState({ selectedUser: data.value });
    this.props.selectedUser(data.value);
  }

  render() {
    return (
      <div>
        <Select placeholder='Select user role' options={this.state.users} 
          onChange={(e,data) => this.selectUser(data)}
          value={this.state.selectedUser} />
      </div>
    );
  }
}