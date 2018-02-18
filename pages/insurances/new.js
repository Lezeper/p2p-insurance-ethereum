import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Container from '../../components/Container';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';
import User from '../../components/User';

export default class NewInsurance extends Component {
  state = {
    errorMessage: '',
    loading: false,
    selectedUser: '',
    seconds: 0
  };

  onSubmit = async event => {
    event.preventDefault();
    if(this.state.selectedUser.length === 0) return;

    this.setState({ loading: true, errorMessage: '' });
    
    try {
      await factory().methods
        .createInsurance(this.state.seconds)
        .send({
          from: this.state.selectedUser
        });
        Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Container>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Insured</label>
            <User selectedUser={this.selectUser} />
          </Form.Field>
          <Form.Field>
            <label>Insurance Duration</label>
            <Input
              type="number"
              label="s"
              labelPosition="right"
              value={this.state.seconds}
              onChange={(e,d) => this.setState({ seconds: d.value })}
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create
          </Button>
          <Button onClick={this.backToHome} content="Back" />
        </Form>

      </Container>
    );
  }

  selectUser = (address) => {
    this.setState({ selectedUser: address });
  }

  backToHome = () => {
    Router.pushRoute('/');
  }
}