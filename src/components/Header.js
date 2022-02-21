import { AppBar, Toolbar, Typography, Container, Select, MenuItem, makeStyles, createTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CryptoState } from '../CryptoContext';
// import './/styles.css'

const useStyles = makeStyles(() => ({
    title: {
        flex: 1,
        color: 'gold',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontFamily: 'Poppins'
    }
}))



const Header = () => {

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: '#fff'
            },
            type: 'dark'
        }
    })

    const classes = useStyles();
    const navigate = useNavigate();

    const {currency, setCurrency} = CryptoState();

    // console.log(currency);

  return (

    <ThemeProvider theme={darkTheme}>
        <AppBar color='transparent' position='static'>
        <Container>
            <Toolbar >
                <Typography 
                    onClick={() => {navigate('/')}} 
                    className={classes.title}
                    varient='h5' 
                >
                    Crypto Hunter
                </Typography>

                <Select 
                    variant='outlined'
                    style={{
                        width: 100,
                        height: 45,
                        marginRight: 15
                    }}
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    >
                    <MenuItem value={"USD"}>USD</MenuItem>
                    <MenuItem value={"INR"}>INR</MenuItem>
                </Select>
            
            </Toolbar>
        </Container>
        
        </AppBar>
    </ThemeProvider>
    
  )
}

export default Header