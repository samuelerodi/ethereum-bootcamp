/*
 * AboutPage
 */

import React from 'react';
import {
  // AccountData,
  // ContractData,
  // ContractForm
} from 'drizzle-react-components';
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
    this.state={
      missing:[],
      stickers:{
          _stn:[],
          _sId:[],
          _onSale:[],
          _onSalePrice:[]
        },
      ids:[],
      balance:0,
      album:{}
    }
    this.web3=context.drizzle.web3;
    this.ZtickerZ = context.drizzle.contracts.ZtickerZ;
    this.ZtickyZtorage = context.drizzle.contracts.ZtickyZtorage;
    this.ZtickyCoinZ = context.drizzle.contracts.ZtickyCoinZ;
    this.ZtickerZ.methods.albums(0).call().then(r=>this.setState({album:r}));
    //INIT
    this.refresh();
  }
  refresh=()=>{
    this.web3.eth.getAccounts()
    .then(r=>this.setState({account:r[0]}))
    .then(r=>this.ZtickyZtorage.methods.getStickersOf(this.state.account).call())
    .then(r=>this.setState({ids:r}))
    .then(r=>this.ZtickerZ.methods.getStickersDetails(this.state.ids).call())
    .then(r=>this.setState({stickers:r}))
    .then(r=>console.log(this.state.stickers))
    .then(r=>{
      var missing=[];
      for (var i=0;i<this.state.album.nStickers; i++){
        if(!this.state.stickers._stn.includes(i.toString())) missing.push(i);
      }
      this.setState({missing:missing});
    });
    this.web3.eth.getAccounts()
    .then(r=> this.ZtickyCoinZ.methods.balanceOf(this.state.account).call())
    .then(r=> this.setState({balance:this.web3.utils.fromWei(r,'ether')}));
  }
  buyNewPack = () => {
    this.ZtickerZ.methods.unwrapStickerPack(0).send({
      value:this.state.album.packPrice,
      gas: 1500000,
      gasPrice: 4000000000
    })
    .then(()=>this.refresh());
  }
  componentDidMount() {
   }
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
                  {this.state.ids.map((el,idx)=>{
                    return (<Col xs="3" key={el}>
                      <Sticker  stn={this.state.stickers._stn[idx]}
                                stickerId={el}
                                onSale={this.state.stickers._onSale[idx]}
                                price={this.state.stickers._onSalePrice[idx]}
                                refresh={this.refresh}></Sticker>
                    </Col>)
                  })}
                </Row>
              </div>
            </aside>
            <main className="col-md-3 order-md-2">
              <h2>Buy a new Pack</h2>
              <p>Start off by buying a new sticker pack!</p>
              <Button className="btn btn-success" onClick={this.buyNewPack}>Buy a Zticker Pack</Button>
              <h2 className="mt-5">My Collection</h2>
              <p>This is a recap of your collection</p>
              <ul className="flex-column">
                <li>
                  <p><strong> Number of stickers in the album:</strong> {this.state.album.nStickers} </p>
                </li>
                <li>
                  <p><strong> Total collected stickers:</strong> {this.state.album.nStickers - this.state.missing.length} </p>
                </li>
                <li>
                  <p><strong> Your balance:</strong> {parseFloat(this.state.balance).toFixed(3)} <strong>ZCZ</strong> </p>
                </li>
                <li>
                  <p><strong> Missing stickers:</strong> {this.state.missing.length}</p>
                </li>
                <Row>
                {this.state.missing.map(i=>{
                  return (<Col xs="6" key={'missing_' + i}>
                      <StickerSm stn={i}></StickerSm>
                    </Col>)
                })}
                </Row>
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
