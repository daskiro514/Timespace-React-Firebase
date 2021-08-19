import React, { useEffect, useState } from "react";
import {
	ListGroup,
	ListGroupItem,
	Row,
	Col,
	FormInput,
	Button,
} from "shards-react";
import { BsTrash, BsPencil } from "react-icons/bs";
import { MdClose } from "react-icons/md";
const Languages = [
	{
		id: 1,
		languageName: "English",
	},
	{
		id: 2,
		languageName: "Kannad",
	},
];
const AvailableLanguage = () => {
	const [language, setLanguage] = useState("");
	const [languageData, setLanguageData] = useState([]);
	const [updateLanguage, setUpdateLanguage] = useState("");
	const [classUpdate, setClassUpdate] = useState(false);
	const [editID, setEditID] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const handleSave = () => {
		const addLanguageData = {
			languageName: language,
		};
		setLanguageData(prevState => [...prevState, addLanguageData]);
	};
	const handleClear = () => {
		setLanguage("");
	};
	const handleEdit = id => {
		setEditID(id);
		setClassUpdate(true);
	};
	const handleCancel = () => {
		setEditID(0);
		setClassUpdate(false);
	};
	const handleDelete = id => {
		const result = window.confirm(
			"Are you sure you want to delete this account"
		);
		if (result) {
			setLanguageData(prevState => prevState.filter(x => x.id !== id));
		}
	};
	const handleUpdate = id => {
		if (updateLanguage !== "") {
			const elementIndex = languageData.findIndex(x => x.id === id);
			const newArray = [...languageData];
			newArray[elementIndex] = {
				...newArray[elementIndex],
				languageName: updateLanguage,
			};
			setLanguageData(newArray);
			setEditID(0);
			setClassUpdate(false);
		} else {
			setEditID(0);
			setClassUpdate(false);
		}
	};
	useEffect(() => {
		setLanguageData(Languages);
		setIsLoading(false);
	}, []);
	if (isLoading) {
		return <div>Please Wait..</div>;
	}
	return (
		<ListGroup flush>
			<ListGroupItem className="p-3">
				<Row>
					<Col>
						<Row form>
							<Col md="6" className="form-group">
								<label className="border-bottom pb-2 d-block font-weight-bold">
									Manage Languages
								</label>
							</Col>
						</Row>
						<Row form>
							<Col md="6" className="form-group">
								<FormInput
									placeholder="Language Name"
									defaultValue={language}
									onChange={e => setLanguage(e.target.value)}
								/>
							</Col>
							<Col>
								<Button
									outline
									size="sm"
									style={{ fontSize: "14px" }}
									onClick={() => handleClear()}
								>
									<MdClose />
								</Button>
							</Col>
						</Row>
						<Button theme="primary" onClick={() => handleSave()}>
							Save
						</Button>
					</Col>
					<Col md="7">
						<table className="table mb-0">
							<thead className="bg-dark">
								<tr>
									<th scope="col" className="border-0">
										Language
									</th>
									<th scope="col" className="border-0">
										Action
									</th>
								</tr>
							</thead>
							{languageData.map((item, i) => {
								return (
									<tbody>
										{classUpdate && editID === item.id ? (
											<tr key={i}>
												<td>
													<FormInput
														placeholder="Language Name"
														defaultValue={item.languageName}
														onChange={e => setUpdateLanguage(e.target.value)}
													/>
												</td>
												<td className="d-flex align-items-center">
													<Button
														size="sm"
														theme="primary"
														className="mr-2"
														onClick={() => handleUpdate(item.id)}
													>
														<i className="material-icons">update</i>
													</Button>
													<Button
														size="sm"
														theme="primary"
														onClick={() => handleCancel()}
													>
														<MdClose />
													</Button>
												</td>
											</tr>
										) : (
											<tr key={i}>
												<td>{item.languageName}</td>
												<td className="d-flex align-items-center">
													<Button
														size="sm"
														pill
														theme="success"
														className="mr-2"
														onClick={() => handleEdit(item.id)}
													>
														<BsPencil />
													</Button>
													<Button
														size="sm"
														pill
														theme="primary"
														onClick={() => handleDelete(item.id)}
													>
														<BsTrash />
													</Button>
												</td>
											</tr>
										)}
									</tbody>
								);
							})}
						</table>
					</Col>
				</Row>
			</ListGroupItem>
		</ListGroup>
	);
};

export default AvailableLanguage;
