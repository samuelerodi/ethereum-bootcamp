import React from 'react';
import './component.css';
import stns from './constants';
/* eslint-disable react/prefer-stateless-function */

import { Card, CardImg, CardBody, CardTitle, CardSubtitle, Button, Media, Row, Col } from 'reactstrap';

export class Sticker extends React.Component {
  constructor(){
    super()
  }
  render() {
    let img = stns[this.props.stn];
    return (
      <div>
        <Card>
          <CardImg top width="100%" src={img} alt="Zticker" />
          <CardBody>
            <CardTitle>{this.props.stn}</CardTitle>
            <CardSubtitle>{this.props.stickerId}</CardSubtitle>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export class StickerSm extends React.Component {
  constructor(){
    super()
  }
  render() {
    let img = stns[this.props.stn];
    return (
      <Row className="mt-3" tag="li">
        <Col xs="6" className="text-right">
          <img width="100%" src={img} alt="Zticker" />
        </Col>
        <Col xs="6">
          <div  className="mt-3">No. <strong>{this.props.stn}</strong></div>
        </Col>
      </Row>
    );
  }
}
