"use client"

import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Box, Button, Grid, Modal, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ENDPOINT } from '../constant';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Products() {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const [rows, setRows] = React.useState([]);
  const [authors, setAuthors] = React.useState([])
  const [flag, setFlag] = React.useState(0)
  const [form, setForm] = React.useState({
    name: '',
    genre: '',
    author: '',
  })

  React.useEffect(() => {

  }, [flag])

  const createBook = async () => {
    await fetch(`${ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        query: `
        mutation Mutation($authorId: ID!, $name: String, $genre: String) {
          createBook(authorId: $authorId, name: $name, genre: $genre) {
            name
            genre
            author {
              name
              id
            }
          }
        }`,
        variables: {
          authorId: form.author,
          name: form.name,
          genre: form.genre
        }
      }),
    }).then(res => {
      setForm({
        name: '',
        genre: '',
        author: ''
      })
      setOpen(false)
      setFlag(flag + 1)
    }).catch(err => console.log(err)
    )
  }

  const getBooks = async () => {
    return await fetch(`${ENDPOINT}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        query: `query Query {
          books {
            id
            name
            genre
            author {
              id
              name
            }
          }
          authors {
            id
            name
          }
        }`
      })
    })

  }

  React.useEffect(() => {
    getBooks()
      .then(res => res.json())
      .then(data => {
        setRows(data.data.books)
        setAuthors(data.data.authors)
      })
  }, [flag])

  return (
    <Box>
      <Paper sx={{ p: '8px', m: '8px' }}>
        <Button variant='contained' onClick={() => setOpen(true)}>
          New
        </Button>
        <Modal
          keepMounted
          open={open}
          onClose={handleClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style}>
            <Grid>
              <Grid container justifyContent={'space-between'}>
                <Grid item xs></Grid>
                <Grid item xs={2}>
                  <Button onClick={handleClose} variant='outlined' sx={{ borderRadius: '50%' }}>
                    <CloseIcon />
                  </Button>
                </Grid>
              </Grid>
              <Grid>
                <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                  Add New Book
                </Typography>
                <Box sx={{}}>
                  <TextField id="filled-basic" label="Name" variant="filled" fullWidth onChange={(ev) => setForm({ ...form, name: ev.target.value })} />
                  <TextField id="filled-basic" label="Genre" variant="filled" fullWidth onChange={(ev) => setForm({ ...form, genre: ev.target.value })} />
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
                    <InputLabel id="demo-simple-select-standard-label">Author</InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={form.author}
                      label="Author"
                      onChange={(ev) => setForm({ ...form, author: ev.target.value })}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {authors.map((author: any, idx: any) => (
                        <MenuItem key={idx} value={author.id}>
                          {author.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box textAlign={'center'} pt={8} >
                  <Button variant='outlined' onClick={createBook}>ADD</Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </Paper>
      <Paper sx={rows.length > 0 ? { p: '8px' } : { p: '8px', textAlign: 'center' }}>
        {
          rows.length > 0
            ? <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>name</TableCell>
                    <TableCell align="right">genre</TableCell>
                    <TableCell align="right">author</TableCell>
                    <TableCell align="right">action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row: any) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.genre}</TableCell>
                      <TableCell align="right">{row.author.name}</TableCell>
                      <TableCell align="right">
                        <Button variant='contained' sx={{ mr: '8px', bgcolor: 'green' }}>Edit</Button>
                        <Button variant='contained' sx={{ bgcolor: 'red' }}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            : <Typography>No Data</Typography>
        }
      </Paper>
    </Box>
  );
}
