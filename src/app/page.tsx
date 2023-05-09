"use client"

import { Box, Grid, Paper } from '@mui/material'
import { gql, useQuery } from '@apollo/client'
import { GET_BOOKS_AUTHORS } from './api'

export default function Home() {

  const { loading, error, data } = useQuery(GET_BOOKS_AUTHORS) 

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid item xs>
          <Paper sx={{ bgcolor: 'red', justifyContent: 'space-around', padding: '8px', m: '8px', color: 'white', textAlign: 'center' }}>
            <Grid >Books</Grid>
            <Grid >{data?.books.length}</Grid>
          </Paper>
        </Grid>
        <Grid item xs >
          <Paper sx={{ bgcolor: 'green', padding: '8px', m: '8px', color: 'white', textAlign: 'center' }}>
            <Grid >Authors</Grid>
            <Grid >{data?.authors.length}</Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
