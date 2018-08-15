/*
 * AboutPage
 */

import React from 'react';
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components';
import { drizzleConnect } from 'drizzle-react';
import { Container, Row, Col, Button } from 'reactstrap';
import {MarketSticker} from '../../components/Sticker';
import PropTypes from 'prop-types';

import ZtickerZ from '../../instances/ZtickerZ';
import ZtickyZtorage from '../../instances/ZtickyZtorage';
import ZtickyCoinZ from '../../instances/ZtickyCoinZ';

import web3 from '../../config/web3';
import {album, getStickersOf, getStickersDetails, getOrderBook} from '../../utils/ZtickerZ';
import {fromZCZ, toZCZ} from '../../utils/ZtickyCoinZ';



class MarketPage extends React.PureComponent {
  /**
   * when initial state username is not null, submit the form to load repos
   */
   constructor(props, context) {
    super(props);
    this.state={
      reload:false
    };
    this.stickers={
        _stn:[],
        _sId:[],
        _onSale:[],
        _onSalePrice:[]
      };
    this.orderBook={
      stickers:[],
      prices:[],
      sellers:[]
    };
    this.balance=0;
    this.web3=web3;
    this.refresh();
  }

  instantiateContracts = () =>{
    if (this.loaded) return Promise.resolve();
    return ZtickerZ.deployed()
    .then((r)=>this.ZtickerZ=r)
    .then(()=>ZtickyZtorage.deployed())
    .then((r)=>this.ZtickyZtorage=r)
    .then(()=>ZtickyCoinZ.deployed())
    .then((r)=>this.ZtickyCoinZ=r)
    .then(r=>{
      return new Promise(function(resolve,reject){
        this.web3.eth.getAccounts((e,r)=>{
          if(e)return reject(e);
          this.account=r[0];
          resolve(this.account);
        })
      }.bind(this))
     })
    .then(()=>this.loaded=true);
  }
  reRender=()=>{
    this.setState({reload:!this.state.reload});
  }

  refresh = ()=>{
    this.instantiateContracts()
    .then(r=>this.ZtickerZ.getOrderBook())
    .then(r=>getOrderBook(r))
    .then(r=>this.orderBook=r)
    .then(r=>this.ZtickerZ.getStickersDetails(this.orderBook.stickers))
    .then(r=>getStickersDetails(r))
    .then(r=>this.stickers=r)
    .then(r=> this.ZtickyCoinZ.balanceOf(this.account))
    .then(r=> this.balance=toZCZ(r))
    .then(r=>this.reRender());
  }
  componentDidMount() { }
  render() {
    return (
      <div className="mt-5">
        <Container className="text-left">
          <Row>
            <aside className="border col-md-9 order-md-1">
              <h2>The Marketplace</h2>
              <p>Buy the rarest stickers on sale!</p>
              <div className="border-top">
                <Row>
                  {this.stickers._sId.map((el,idx)=>{
                    return (<Col xs="3" key={el}>
                      <MarketSticker
                                ac={this.ZtickyZtorage}
                                cc={this.ZtickyCoinZ}
                                zz={this.ZtickerZ}
                                account={this.account}
                                balance={this.balance}
                                stn={this.stickers._stn[idx]}
                                stickerId={el}
                                onSale={this.stickers._onSale[idx]}
                                price={this.stickers._onSalePrice[idx]}
                                seller={this.orderBook.sellers[idx]}
                                refresh={this.refresh}></MarketSticker>
                    </Col>)
                  })}
                </Row>
              </div>
            </aside>
            <main className="col-md-3 order-md-2">
              <h2>Your ZCZ balance:</h2>
              <h4>{parseFloat(this.balance).toFixed(3)} <strong>ZCZ</strong></h4>
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
    drizzleStatus: state.drizzleStatus
  }
}

MarketPage.contextTypes = {
  drizzle: PropTypes.object
}
const MarketContainer = drizzleConnect(MarketPage, mapStateToProps);
export default MarketContainer;
