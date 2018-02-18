import React, { Component } from 'react';
import { Card, Button, Grid } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Container from '../components/Container';
import { Link } from '../routes';

class InsuranceIndex extends Component {
  static async getInitialProps() {
    const insurances = await factory().methods.getDeployedInsurances().call();
    return { insurances };
  }

  renderInsurance() {
    const items = this.props.insurances.map(address => {
      return {
        header: address,
        description: (
          <Link route={`/insurances/${address}`}>
            <a>View Insurance</a>
          </Link>
        ),
        fluid: true
      }
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Container>
        <Grid>
          <Grid.Row>
            {this.renderInsurance()}
          </Grid.Row>
          <Grid.Row>
            <Link route="/insurances/new">
              <Button content="Create Insurance" primary />
            </Link>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default InsuranceIndex;