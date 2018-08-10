/*
 * AboutPage
 */

import React from 'react';
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Button } from 'reactstrap';
import {Sticker, StickerSm} from '../../components/Sticker';


class MyAlbumPage extends React.PureComponent {
  /**
   * when initial state username is not null, submit the form to load repos
   */
   constructor(props, context) {
    super(props);
    this.contracts = context.drizzle.contracts
  }
  componentDidMount() { }
  render() {
    return (
      <div className="mt-5">
        <Container className="text-left">
          <Row>
            <aside className="border col-md-9 order-md-1">
              <h2>My Album</h2>
              <p>Here you can find all your stickers!</p>
              <div className="border-top">
                <Row>
                  <Col xs="4">
                    <Sticker stn="0" stickerId="222"></Sticker>
                  </Col>
                  <Col xs="4">
                    <Sticker stn="0" stickerId="222"></Sticker>
                  </Col>
                  <Col xs="4">
                    <Sticker stn="0" stickerId="222"></Sticker>
                  </Col>
                </Row>
                <Row>
                  <Col xs="4">
                    <Sticker stn="0" stickerId="222"></Sticker>
                  </Col>
                  <Col xs="4">
                    <Sticker stn="0" stickerId="222"></Sticker>
                  </Col>
                </Row>
                <Row>
                  <Col xs="4">
                    <Sticker stn="0" stickerId="222"></Sticker>
                  </Col>
                  <Col xs="4">
                    <Sticker stn="0" stickerId="222"></Sticker>
                  </Col>
                </Row>
              </div>
            </aside>
            <main className="col-md-3 order-md-2">
              <h2>Buy a new Pack</h2>
              <p>Start off by buying a new sticker pack!</p>
              <Button className="btn btn-success">Buy a Zticker Pack</Button>
              <h2 className="mt-5">My Collection</h2>
              <p>This is a recap of your collection</p>
              <ul className="flex-column">
                <li>
                  <p><strong> Number of stickers in the album:</strong> </p>
                </li>
                <li>
                  <p><strong> Total collected stickers:</strong> 2</p>
                </li>
                <li>
                  <p><strong> Your <strong>ZCZ</strong>  balance:</strong> 0</p>
                </li>
                <li>
                  <p><strong> Missing stickers:</strong> <i> in total 3</i></p>
                </li>
                <StickerSm stn="1"></StickerSm>
                <StickerSm stn="2"></StickerSm>
              </ul>
            </main>
            </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    ZtickyZtorage: state.contracts.ZtickyZtorage,
    ZtickyCoinZ: state.contracts.ZtickyCoinZ,
    ZtickerZ: state.contracts.ZtickerZ,
    drizzleStatus: state.drizzleStatus
  }
}

MyAlbumPage.contextTypes = {
  drizzle: PropTypes.object
}
const MyAlbumContainer = drizzleConnect(MyAlbumPage, mapStateToProps);
export default MyAlbumContainer;
