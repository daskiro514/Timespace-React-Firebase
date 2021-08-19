import React from "react";
import {
	CBadge,
	CCard,
	CCardBody,
	CCardHeader,
	CCol,
	CDataTable,
	CRow,
} from "@coreui/react";
import { DocsLink } from "src/reusable";

import usersData from "../../../Timespace/Users/UsersData";

const getBadge = status => {
	switch (status) {
		case "Active":
			return "success";
		case "Inactive":
			return "secondary";
		case "Pending":
			return "warning";
		case "Banned":
			return "danger";
		default:
			return "primary";
	}
};
const fields = ["name", "registered", "role", "status"];

const Tables = () => {
	return (
		<>
			<CRow>
				<CCol xs="12" md="12">
					<CCard style={{ width: "200%" }}>
						<CCardHeader>
							Simple Table
							<DocsLink name="CModal" />
						</CCardHeader>
						<CCardBody>
							<CDataTable
								items={usersData}
								fields={fields}
								itemsPerPage={5}
								pagination
								scopedSlots={{
									status: item => (
										<td>
											<CBadge color={getBadge(item.status)}>
												{item.status}
											</CBadge>
										</td>
									),
								}}
							/>
						</CCardBody>
					</CCard>
				</CCol>
			</CRow>
		</>
	);
};

export default Tables;
