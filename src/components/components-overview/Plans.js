import React from "react";
import { Col, Form, FormInput, FormGroup, Card, FormSelect } from "shards-react";

const PlanWrapper = (props) => {
  return (
    <>
      <Col sm="12" md="3">
        <Card className="p-3">
          <strong className=" d-block mb-2">{props.headerTitle}</strong>
          <Form>
            <FormGroup>{props.children}</FormGroup>
          </Form>
        </Card>
      </Col>
    </>
  );
};

const Plans = (props) => (
  <>
    <PlanWrapper headerTitle="Plan Type">
      <FormInput
        placeholder="Plan Type"
        value={props.planType}
        onChange={(e) => props.setPlanType(e.target.value)}
      />
    </PlanWrapper>
    <PlanWrapper headerTitle="Price">
      <FormInput
        placeholder="Price"
        value={props.price}
        onChange={(e) => props.setPrice(e.target.value)}
      />
    </PlanWrapper>
    <PlanWrapper headerTitle="Duration">
      <FormInput
        placeholder="Duration"
        value={props.duration}
        onChange={(e) => {
          props.setDuration(e.target.value);
          props.setDurationAuth("none");
        }}
      />
      <p style={{ color: "red", display: props.durationAuth }}>
        Duration Should be a Digit and not blank
      </p>
    </PlanWrapper>

    <PlanWrapper headerTitle="Duration Unit">
      <FormSelect
        id="feInputState"
        name="durationUnit"
        value={props.choosedUnit}
        onChange={(e) => props.setChoosedUnit(e.target.value)}
      >
        {props.durationUnits.map((each, id) => {
          return <option key={id}>{each}</option>;
        })}
      </FormSelect>
    </PlanWrapper>
  </>
);

export default Plans;
