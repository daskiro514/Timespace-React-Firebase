import React from "react"
import { Row, Col, ListGroup, ListGroupItem, FormInput, Button } from "shards-react"
import { CSwitch } from '@coreui/react'
import Modal from "../../../components/common/Modal"
import firebase from "../../../util/firebase"
const db = firebase.firestore()

const FeedbackTypeUpdateModal = ({ setFeedbackTypeModalForUpdate, FeedbackType, classNames, getFeedbackTypes, setIsFeedbackTypesLoading }) => {
  const [feedbackType, setFeedbackType] = React.useState("")
  const [status, setStatus] = React.useState(false)

  React.useEffect(() => {
    setFeedbackType(FeedbackType.feedbackType)
    setStatus(FeedbackType.status)
  }, [FeedbackType])

  const updateFeedbackType = async () => {
    if (feedbackType) {
      setIsFeedbackTypesLoading(true)
      await db.collection("feedback_types").doc(FeedbackType.id).update({
        feedbackType: feedbackType,
        status: status,
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
    setFeedbackTypeModalForUpdate(false)
  }

  return (
    <Modal
      classNames={classNames}
      title="Update FeedbackType"
      onClick={() => closeModal()}
    >
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row form>
            <Col md="12" className="form-group">
              <label className="d-block" style={{ fontWeight: 'bold' }}>FeedbackType Name:</label>
              <FormInput
                placeholder="FeedbackType Name"
                value={feedbackType ? feedbackType : ""}
                onChange={e => setFeedbackType(e.target.value)}
              /><br /><br />
              <label style={{ fontWeight: 'bold' }}>FeedbackType Status:</label>
              <CSwitch onChange={() => setStatus(!status)} checked={status ? true : false} className='mb-0 float-right' color='info' size='lg' tabIndex="0" /><br /><br />
              <Button onClick={() => updateFeedbackType()} size="sm" theme="primary" style={{ float: "right" }}>
                Update
              </Button>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Modal>
  )
}

export default FeedbackTypeUpdateModal