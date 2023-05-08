"use client"

import { Box, Grid, Paper } from '@mui/material'
import { useEffect, useState } from 'react'
import { ENDPOINT } from './constant'

export default function Home() {

  const [count, setCount] = useState({
    books: 0,
    author: 0
  })

  const getData = async () => { 
    return await fetch(`${ENDPOINT}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `query {
          books {
            name
          }
          authors {
            name
          }
        }`
      })
    })
  }

  useEffect(() => {
    getData()
      .then(res => res.json())
    .then(data => setCount({ books: data.data.books.length, author: data.data.authors.length }))
  }, [])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid item xs>
          <Paper sx={{ bgcolor: 'red', justifyContent: 'space-around', padding: '8px', m: '8px' , color: 'white', textAlign: 'center'}}>
            <Grid >Books</Grid>
            <Grid >{count.books}</Grid>
          </Paper>
        </Grid>
        <Grid item xs >
          <Paper sx={{ bgcolor: 'green', padding: '8px', m: '8px', color: 'white', textAlign: 'center' }}>
            <Grid >Authors</Grid>
            <Grid >{count.author}</Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
