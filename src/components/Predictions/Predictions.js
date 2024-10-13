import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse, IconButton, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import Paper from '@mui/material/Paper';

// Function to create data rows with a collapsible state
function createData(disease, probability, details) {
  return {
    disease,
    probability,
    details,
    open: false, // Used to control the expandable row
  };
}

// Sample data to populate the table
const rows = [
  createData('Heart Disease', '75%', 'This is the expandable detailed explanation for Heart Disease.'),
  createData('Diabetes', '60%', 'This is the expandable detailed explanation for Diabetes.'),
  createData('Hypertension', '50%', 'This is the expandable detailed explanation for Hypertension.'),
  createData('Asthma', '30%', 'This is the expandable detailed explanation for Asthma.'),
];

function Prediction() {
  const [data, setData] = useState(rows);

  // Toggle collapse for rows based on the index
  const toggleRow = (index) => {
    setData((prevData) =>
      prevData.map((row, i) => (i === index ? { ...row, open: !row.open } : row))
    );
  };

  return (
    <Card>
      <CardHeader color="success" stats icon>
        <CardIcon color="success">
          <HealthAndSafetyIcon />
        </CardIcon>
        <Typography variant="h6">Disease Prediction</Typography>
      </CardHeader>
      <CardBody>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Disease</TableCell>
                <TableCell align="right">Probability (%)</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <React.Fragment key={row.disease}>
                  <TableRow>
                    <TableCell>{row.disease}</TableCell>
                    <TableCell align="right">{row.probability}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => toggleRow(index)}
                      >
                        {row.open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Collapse in={row.open} timeout="auto" unmountOnExit>
                        <Typography variant="body2" style={{ margin: '10px' }}>
                          {row.details}
                        </Typography>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
}

export default Prediction;
