import React from "react"
import { Container, Card, CardHeader, CardBody, CardFooter, Row, Col, Button, FormInput } from "shards-react"
import { BsTrash, BsPencil } from "react-icons/bs"
import Papa from 'papaparse'
import PageTitle from "../../components/common/PageTitle"
import firebase from "../../util/firebase"
const db = firebase.firestore()

const LanguageManagement = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [updateID, setUpdateID] = React.useState("")
  const [words, setWords] = React.useState([])
  const [languagePack, setLanguagePack] = React.useState({})
  const [languagePackForUpdate, setLanguagePackForUpdate] = React.useState({})
  const [languagePacks, setLanguagePacks] = React.useState([])
  const [languageLists, setLanguageLists] = React.useState([])

  React.useEffect(() => {
    setIsLoading(true)
    async function fetchData() {
      await getLanguageLists()
      await getLanguagePacks()
    }
    fetchData()
  }, [])

  const addNewLanguage = async () => {
    let sendData = { ...languagePack }
    sendData.created_at = firebase.firestore.Timestamp.now()
    sendData.updated_at = firebase.firestore.Timestamp.now()
    setIsLoading(true)
    await db.collection("language_management").add(sendData)
    await getLanguagePacks()
    clearCreateInput()
  }

  const getLanguageLists = async () => {
    setLanguageLists((await db.collection("Languages").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })))
  }

  const getLanguagePacks = async () => {
    let tempLanguagePacks = (await db.collection("language_management").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => a.created_at - b.created_at)
    setLanguagePacks(tempLanguagePacks)
    setIsLoading(false)
  }

  const handleSetLanguagePack = async (value, name) => {
    let tempLanguagePack = { ...languagePack }
    tempLanguagePack[name] = value
    setLanguagePack(tempLanguagePack)
  }

  const setForUpdate = (forUpdate) => {
    setUpdateID(forUpdate.id)
    setLanguagePackForUpdate(forUpdate)
  }

  const handleForUpdate = (value, name) => {
    let temp = { ...languagePackForUpdate }
    temp[name] = value
    setLanguagePackForUpdate(temp)
  }

  const updateLanguagePack = async () => {
    let sendData = { ...languagePackForUpdate }
    sendData.updated_at = firebase.firestore.Timestamp.now()
    setIsLoading(true)
    await db.collection("language_management").doc(updateID).update(sendData)
    setUpdateID("")
    await getLanguagePacks()
  }

  const deleteLanguagePack = async (idForDel) => {
    let deleteAnswer = window.confirm("Are you sure?")
    if (deleteAnswer) {
      setIsLoading(true)
      await db.collection("language_management").doc(idForDel).delete()
      await getLanguagePacks()
    }
  }

  const clearCreateInput = () => {
    let temp = { ...languagePack }
    Object.keys(temp).forEach(element => {
      temp[element] = ""
    })
    setLanguagePack(temp)
  }

  const getCsvData = (file) => {
    var fr = new FileReader()
    fr.onload = () => {
      const results = Papa.parse(fr.result, { header: true })
      let rows = results.data
      let tempRows = []
      rows.forEach(element => {
        if (element["English"]) tempRows.push(element)
      });
      setWords(tempRows)
    }
    fr.readAsText(file)
  }

  const addWords = async () => {
    if (words.length) setIsLoading(true)
    for (let i = 0; i < words.length; i++) {
      let word = words[i]
      word.created_at = firebase.firestore.Timestamp.now()
      word.updated_at = firebase.firestore.Timestamp.now()
      await db.collection("language_management").add(word)
    }
    await getLanguagePacks()
  }

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle sm="6" title="Language Management" className="text-sm-left" />
      </Row>

      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom d-md-flex align-items-md-center justify-content-md-between">
              <h6 className="m-0">Import Language From CSV</h6>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md="6">
                  <input
                    type="file"
                    onChange={(e) => getCsvData(e.target.files[0])}
                  />
                </Col>
                <Col md="6">
                  <p>There are {words.length} words in the file.</p>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Button onClick={addWords}>Save</Button>
            </CardFooter>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom d-md-flex align-items-md-center justify-content-md-between">
              <h6 className="m-0">Translate Language</h6>
            </CardHeader>
            <CardBody>
              <Row>
                {languageLists.map((each, i) =>
                  <Col md="6" key={i}>
                    <Card className="p-3">
                      <strong className="d-block mb-2">{each.name}</strong>
                      <FormInput
                        placeholder={each.name}
                        value={languagePack[each.name]}
                        onChange={(e) => handleSetLanguagePack(e.target.value, each.name)}
                      />
                    </Card>
                  </Col>
                )}
              </Row>
            </CardBody>
            <CardFooter>
              <Button onClick={addNewLanguage}>Create</Button>
            </CardFooter>
          </Card>
        </Col> */}

        <Col sm="12 mt-4">
          <Card small className="mb-4">
            <CardHeader className="border-bottom d-md-flex align-items-md-center justify-content-md-between">
              <h6 className="m-0">Languages List</h6>
            </CardHeader>
            <CardBody className="p-0">
              <table className="table mb-0">
                <thead className="bg-dark">
                  <tr>
                    <th scope="col" className="border-0">No</th>
                    {languageLists.map((each, i) =>
                      <th scope="col" className="border-0" key={i}>{each.name}</th>
                    )}
                    <th scope="col" className="border-0">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? <IsLoading /> :
                    <LanguagePackLists
                      languagePacks={languagePacks}
                      languageLists={languageLists}
                      deleteLanguagePack={deleteLanguagePack}
                      updateID={updateID}
                      setUpdateID={setUpdateID}
                      setForUpdate={setForUpdate}
                      updateLanguagePack={updateLanguagePack}
                      handleForUpdate={handleForUpdate}
                      languagePackForUpdate={languagePackForUpdate}
                    />
                  }
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

const LanguagePackLists = ({ languagePacks, languageLists, deleteLanguagePack, updateID, setUpdateID, updateLanguagePack, setForUpdate, handleForUpdate, languagePackForUpdate }) => {
  return (
    languagePacks.map((each, i) => each.id === updateID ?
      (<tr key={i}>
        <td>{i + 1}</td>
        {languageLists.map((subEach, i) =>
          <td key={i}>
            <FormInput
              size="sm"
              placeholder={each.name}
              value={languagePackForUpdate[subEach.name]}
              onChange={e => handleForUpdate(e.target.value, subEach.name)}
            />
          </td>
        )}
        <td className="d-flex align-items-center">
          <Button size="sm" pill theme="success" onClick={() => updateLanguagePack()}>
            Update
          </Button>&nbsp;
          <Button size="sm" pill theme="primary" onClick={() => setUpdateID("")} >
            Cancel
          </Button>
        </td>
      </tr>) :
      (<tr key={i}>
        <td>{i + 1}</td>
        {languageLists.map((subEach, i) =>
          <td key={i}>{each[subEach.name]}</td>
        )}
        <td className="d-flex align-items-center">
          <Button size="sm" pill theme="primary" onClick={() => setForUpdate(each)}>
            <BsPencil />
          </Button>
          {/* <Button size="sm" pill theme="danger" onClick={() => deleteLanguagePack(each.id)}>
            <BsTrash />
          </Button> */}
        </td>
      </tr>)
    )
  )
}

const IsLoading = () => {
  return (
    <tr><td>LOADING ... </td></tr>
  )
}

export default LanguageManagement