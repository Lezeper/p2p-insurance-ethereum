import React, { Component } from 'react';
import { Card, Grid, Button, Input, Message, Select } from 'semantic-ui-react';
import Container from '../../components/Container';
import Insurance from '../../ethereum/insurance';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';
import User from '../../components/User';

export default class ShowInsurance extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: '',
      errorMessage: '',
      loading: false,
      premium: 0,
      contributeEth: 0,
      selectedUser: '',
      isClaimable: false,
    };
  }

  static async getInitialProps(props) {
    const summary = await Insurance(props.query.address).methods.getSummary().call();
    
    return {
      address: props.query.address,
      insured: summary[0],
      premium: summary[1],
      balance: summary[2],
      status: summary[3],
      isLocked: summary[4],
      contributorList: summary[5],
      claimerList: summary[6],
      contractStartTime: summary[7],
      contractDuration: summary[8]
    };
  }

  premiumCharge = async event => {
    this.setState({ loading: true, errorMessage: '' });

    try {
      await Insurance(this.props.address).methods.premiumCharge().send({
        from: this.props.insured,
        value: web3.utils.toWei(this.state.premium, 'ether')
      });
      Router.pushRoute(`/insurances/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false, value: '' });
  }

  contribute = async event => {
    this.setState({ loading: true, errorMessage: '' });

    try {
      await Insurance(this.props.address).methods.contribute().send({
        from: this.state.selectedUser,
        value: web3.utils.toWei(this.state.contributeEth, 'ether')
      });

      Router.pushRoute(`/insurances/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false, value: '' });
  }

  renderCards() {

    const items = [
      {
        header: this.props.insured,
        meta: 'Address of Insured',
        description: 'The insurance policy holder',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: web3.utils.fromWei(this.props.premium, 'ether') + ' ETH',
        meta: 'Insurance Premium'
      },
      {
        header: this.props.status.toString(),
        meta: 'The status of this insurance policy',
        description: 'The status of current insurance policy'
      },
      {
        header: this.props.isLocked ? 'CLOSED' : 'OPEN',
        meta: 'Whether this contract is still open or not',
      },
      {
        header: this.props.contributorList.length,
        meta: 'Number of contributor',
        description:
          'Number of people who have already support to this insurance'
      },
      {
        header: this.props.claimerList.length,
        meta: 'Number of claimers',
        description:
          'Number of people who have already claimed from this insurance'
      },
      {
        header: this.props.contractDuration + 's',
        meta: 'How long this contract will keep going'
      },
      {
        header: web3.utils.fromWei(this.props.balance, 'ether') + ' ETH',
        meta: 'Contract Balance',
        description:
          'The balance is how much money this contract has.'
      },
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Container>
        { this.state.errorMessage.length > 0 ?
          <Message error header="Oops!" content={this.state.errorMessage} /> :null
        }
        
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
          </Grid.Row>

          <User selectedUser={this.selectedUser} />
          
          {
            this.state.selectedUser == this.props.insured && this.props.premium == 0 ? 
            <div>
              <Input focus placeholder='premium'
                type="number"
                value={this.state.premium} 
                onChange={(e,d) => this.setState({ premium: d.value })}
              />
              <Button primary loading={this.state.loading} onClick={this.premiumCharge} >
                Premium Charge
              </Button> 
            </div>
            : null
          }

          {
            this.state.selectedUser.length > 0 && this.state.selectedUser != this.props.insured &&
              this.props.premium > 0 && !this.props.isLocked ?
            <div>
              <Input focus placeholder='ether'
                type="number"
                value={this.state.contributeEth} 
                onChange={(e,d) => this.setState({ contributeEth: d.value })}
              />
              <Button primary loading={this.state.loading} onClick={this.contribute} >
                Contribute
              </Button> 
            </div>
            : null
          }

          {
            this.state.isClaimable ?
            <Grid.Row>
              <Button primary loading={this.state.loading} onClick={this.claim} >
                Claim
              </Button>
            </Grid.Row> : null
          }

          <Grid.Row>
            <Button content="Back" onClick={this.backToHome} />
          </Grid.Row>

          {/* <Button content="test" loading={this.state.loading} onClick={this.setStatus} /> */}
        </Grid>
      </Container>
    );
  }

  // setStatus = async () => {
  //   this.setState({ loading: true });
  //   try {
  //     await Insurance(this.props.address).methods.setStatus(0).send({
  //       from: this.state.selectedUser
  //     });
  //   } catch (err) {
  //     this.setState({ errorMessage: err.message });
  //   }
  //   this.setState({ loading: false });
  // }

  claim = async() => {
    this.setState({ loading: true });
    try {
      await Insurance(this.props.address).methods.claim().send({
        from: this.state.selectedUser
      });
      Router.pushRoute(`/insurances/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  }

  selectedUser = async(address) => {
    this.setState({selectedUser: address});

    try {
      this.setState(
        {isClaimable: await Insurance(this.props.address).methods.isClaimable(address).call()}
      );
      Router.pushRoute(`/insurances/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }     
  }

  backToHome = () => {
    Router.pushRoute('/');
  }
}
