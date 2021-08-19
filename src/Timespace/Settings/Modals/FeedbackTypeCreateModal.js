import React from "react"
import { Row, Col, ListGroup, ListGroupItem, FormInput, Button } from "shards-react"
import { CSwitch } from '@coreui/react'
import Modal from "../../../components/common/Modal"
import firebase from "../../../util/firebase"
const db = firebase.firestore()

const FeedbackTypeCreateModal = ({ setFeedbackTypeModalForCreate, classNames, getFeedbackTypes, setIsFeedbackTypesLoading }) => {
  const [feedbackType, setFeedbackType] = React.useState("")
  const [status, setStatus] = React.useState(false)

  const createFeedbackType = async () => {
    if (feedbackType) {
      setIsFeedbackTypesLoading(true);
      await db.collection("feedback_types").add({
        feedbackType: feedbackType,
        status: status,
        created_at: firebase.firestore.Timestamp.now(),
        updated_at: firebase.firestore.Timestamp.now(),
      })
      closeModal()
      await getFeedbackTypes()
    } else {
      alert("Please check the input fields below.")
    }
  }

  const allClear = () => {
    setFeedbackType("")
    setStatus(false)
  }

  const closeModal = () => {
    allClear()
    setFeedbackTypeModalForCreate(false)
  }

  return (
    <Modal
      classNames={classNames}
      title="Create FeedbackType"
      onClick={() => closeModal()}
    >
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row form>
            <Col md="12" className="form-group">
              <label className="d-block" style={{ fontWeight: 'bold' }}>FeedbackType FeedbackType:</label>
              <FormInput
                placeholder="FeedbackType..."
                value={feedbackType ? feedbackType : ""}
                onChange={e => setFeedbackType(e.target.value)}
              /><br /><br />
              <label style={{ fontWeight: 'bold' }}>FeedbackType Status:</label>
              <CSwitch onChange={() => setStatus(!status)} checked={status ? true : false} className='mb-0 float-right' color='info' size='lg' tabIndex="0" /><br /><br />
              <Button onClick={() => createFeedbackType()} size="sm" theme="primary" style={{ float: "right" }}>
                Save
              </Button>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Modal>
  )
}

export default FeedbackTypeCreateModal