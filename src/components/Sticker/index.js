import React from 'react';
import './component.css';
import stns from './constants';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  CardSubtitle,
  CardFooter,
  Button,
  Media,
  Row,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  Col
} from 'reactstrap';

import ZtickerZ from '../../instances/ZtickerZ';
import ZtickyZtorage from '../../instances/ZtickyZtorage';
import ZtickyCoinZ from '../../instances/ZtickyCoinZ';
import web3 from '../../config/web3';
import {album, getStickersOf, getStickersDetails} from '../../utils/ZtickerZ';
import {fromZCZ, toZCZ} from '../../utils/ZtickyCoinZ';

class StickerBox extends React.Component {
  constructor(props, context) {
    super(props);
    this.web3=web3;
    this.state={
      sellPrice:0
    };
  }
  changePrice=(e)=>{
    this.setState({sellPrice:e.target.value});
  }
  sell = (_sId, _price) => {
    console.log(this.props.stickerId, fromZCZ(this.state.sellPrice))
    if (!this.state.sellPrice) return;
    this.props.ac.approveAndSell(this.props.stickerId, fromZCZ(this.state.sellPrice),{
      from: this.props.account,
      gas: 1500000,
      gasPrice: 4000000000
    })
    .then(()=>{
      this.props.refresh();
    });
  }
  cancelOrder = () => {
    if (!this.props.onSale) return;
    this.props.zz.cancelSellOrder(this.props.stickerId,{
      from: this.props.account,
      gas: 1500000,
      gasPrice: 4000000000
    })
    .then(()=>this.props.refresh());
  }

  render() {
    let img = stns[this.props.stn];
    let footer = (
                <CardFooter>
                  <small className="text-muted">Duplicate?</small>
                  <InputGroup size="sm">
                    <Input placeholder="Price..." type="number" step="0.1" onChange={this.changePrice}/>
                    <InputGroupAddon addonType="append">
                      <InputGroupText><strong>ZCZ</strong></InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <Button className="btn btn-sm btn-danger mt-1" disabled={!this.state.sellPrice} onClick={this.sell}>Sell</Button>
                </CardFooter>
                  );
    if (this.props.onSale)
    footer =(
              <CardFooter>
                <small className="text-muted">This is already on sale @{toZCZ(this.props.price).toFixed(2)} <strong>ZCZ</strong></small>
                <Button className="btn btn-sm btn-danger mt-1" onClick={this.cancelOrder}>Cancel order</Button>
              </CardFooter>
              );
    return (
        <Card className="m-1">
          <CardImg top width="100%" src={img} alt="Zticker" className="p-3"/>
          <CardBody>
            <CardTitle># {this.props.stn}</CardTitle>
            <CardSubtitle className="single-line-break">
              <small className="text-muted">UID: <i>{this.props.stickerId}</i></small>
            </CardSubtitle>
          </CardBody>
            {footer}
        </Card>
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

StickerBox.contextTypes = {
  drizzle: PropTypes.object
}
const Sticker = drizzleConnect(StickerBox, mapStateToProps);
export {Sticker as Sticker};

export class StickerSm extends React.Component {
  constructor(){
    super()
  }
  render() {
    let img = stns[this.props.stn];
    return (
      <Row className="mt-3" tag="li">
        <Col xs="5" className="text-right">
          <img width="100%" src={img} alt="Zticker" />
        </Col>
        <Col xs="7">
          <div ># <strong>{this.props.stn}</strong></div>
        </Col>
      </Row>
    );
  }
}



export class MarketSticker extends React.Component {
  constructor(){
    super()
  }
  buy=()=>{
    this.props.cc.buyAndTransfer(this.props.stickerId,{
      from: this.props.account,
      gas: 1500000,
      gasPrice: 4000000000
    })
    .then(()=>this.props.refresh());
  }
  render() {
    let img = stns[this.props.stn];
    let button = (<Button className="btn btn-sm btn-success mt-1" onClick={this.buy}>Buy</Button>);
    if (this.props.price>fromZCZ(this.props.balance) || this.props.seller==this.props.account)
      button = (<Button className="btn btn-sm btn-success mt-1" onClick={this.buy} disabled>Buy</Button>);
    return (
      <Card className="m-1">
        <CardImg top width="100%" src={img} alt="Zticker" className="p-3"/>
        <CardBody>
          <CardTitle># {this.props.stn}</CardTitle>
          <CardSubtitle className="single-line-break">
            <small className="text-muted">UID: <i>{this.props.stickerId}</i></small>
          </CardSubtitle>
        </CardBody>
        <CardFooter>
          <p>Price: {toZCZ(this.props.price).toFixed(2)} <strong>ZCZ</strong> </p>
          {button}
          <br/>
          <small className="text-muted">This is being sold by: </small>
          <p className="single-line-break">{this.props.seller}</p>
        </CardFooter>
      </Card>
    );
  }
}
