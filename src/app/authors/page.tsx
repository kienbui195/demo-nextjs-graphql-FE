"use client"

import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Grid, Modal, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ENDPOINT } from '../constant';
import Link from 'next/link';
import { GET_BOOKS_AUTHORS } from '../api';
import {useQuery, useMutation } from '@apollo/client'

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

export default function Books() {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const [rows, setRows] = React.useState([]);
    const [flag, setFlag] = React.useState(0)
    const [form, setForm] = React.useState({
        name: '',
        age: '',
    })
    const {data, error} = useQuery(GET_BOOKS_AUTHORS)

    const getAuthors = async () => {
        return await fetch(`${ENDPOINT}`, {
            method: "POST",
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                query: `query Query {
                    authors {
                        id
                      name
                      age
                      books {
                        name
                      }
                    }
                  }`
            })
        })
    }

    React.useEffect(() => {
        getAuthors()
            .then(res => res.json())
            .then(data => {
                setRows(data.data.authors)
            })
    }, [flag])

    const createAuthor = async () => {
        await fetch(`${ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `mutation Mutation($name: String, $age: Int) {
                    createAuthor(name: $name, age: $age) {
                      name
                      age
                    }
                  }`,
                variables: {
                    name: form.name,
                    age: +form.age
                }
            })
        })
            .then((res) => {
                setForm({
                    ...form,
                    name: '',
                    age: '',
                })
                setFlag(flag + 1)
                setOpen(false)
            })
    }

    const deleteAuthor = async (id: any) => {
        console.log(id);

        if (window.confirm('Are you sure you want to delete?')) {
            await fetch(`${ENDPOINT}`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    query: `mutation Mutation($deleteAuthorId: ID!) {
                        deleteAuthor(id: $deleteAuthorId) {
                          id
                        }
                      }
                      `,
                    variables: {
                        deleteAuthorId: id
                    }
                })
            }).then(() => setFlag(flag + 1))
        }
    }

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
                                    Add New Author
                                </Typography>
                                <Box sx={{}}>
                                    <TextField id="filled-basic" label="Name" variant="filled" fullWidth onChange={(ev) => setForm({ ...form, name: ev.target.value })} value={form.name || ''} />
                                    <TextField id="filled-basic" label="Age" variant="filled" type="number" fullWidth onChange={(ev) => setForm({ ...form, age: ev.target.value })} value={form.age || ''} />
                                </Box>
                                <Box textAlign={'center'} pt={8}>
                                    <Button variant='outlined' onClick={createAuthor}>ADD</Button>
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
                                        <TableCell align="right">age</TableCell>
                                        <TableCell align="right">books</TableCell>
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
                                                <Link href={`/authors/${row.id}`}>{row.name}</Link>
                                            </TableCell>
                                            <TableCell align="right">{row.age}</TableCell>
                                            <TableCell align="right">{row.books.length}</TableCell>
                                            <TableCell align="right">
                                                <Button variant='contained' sx={{ mr: '8px', bgcolor: 'green' }}>Edit</Button>
                                                <Button variant='contained' sx={{ bgcolor: 'red' }} onClick={() => deleteAuthor(row.id)}>Delete</Button>
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
