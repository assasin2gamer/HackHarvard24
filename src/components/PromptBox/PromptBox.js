import React, { useState } from 'react';
import { TextField, IconButton, CircularProgress, Grid, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NightlightIcon from '@mui/icons-material/Nightlight'; // Import moon icon
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

function PromptBox() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = () => {
    setLoading(true);
    setResult(null); // Clear previous results
    // Template function to simulate an async post request with prompt
    setTimeout(() => {
      setResult(`Result for: "${prompt}"`);
      setLoading(false);
    }, 2000); // Simulate network delay
  };

  return (
    <Card style={{height:'100%'}}>
      <CardHeader color="success" stats icon>
        <CardIcon color="success">
          <NightlightIcon /> {/* Moon icon here */}
        </CardIcon>
        <Typography variant="h6">Prompt Input</Typography>
      </CardHeader>
      <CardBody>
        <Grid container spacing={1} alignItems="center">
        <Grid item xs={10} style={{ marginTop: '16px' }}> {/* Added margin above the TextField */}
        <TextField
              fullWidth
              label="Enter your prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton onClick={handleSearch} color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : <SearchIcon />}
            </IconButton>
          </Grid>
        </Grid>
      </CardBody>
      {result && (
        <CardFooter>
          <Card>
            <CardBody>
              <Typography variant="body1">{result}</Typography>
            </CardBody>
          </Card>
        </CardFooter>
      )}
    </Card>
  );
}

export default PromptBox;
