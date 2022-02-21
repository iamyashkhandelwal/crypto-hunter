import { Container, createTheme, LinearProgress, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, Typography } from '@material-ui/core'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CoinList } from '../api/CoinGekoAPI'
import { CryptoState } from '../CryptoContext'
import { Pagination } from '@material-ui/lab';

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

const useStyles = makeStyles(() => ({
    row: {
        cursor: 'pointer',
        fontFamily: "Poppins",
        "&:hover": {
            backgroundColor: "#131111",
        }
    },
    logo: {
        display: 'inline-block',
        width: 55
    },
    coinInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    pagination: {
        padding: 20,
        display: "flex",
        justifyContent: "center",
    },
    pageUL: {
        "& .MuiPaginationItem-root": {
            color: "gold",
        }
    }
}))

const CoinsTable = () => {

    const navigate = useNavigate();
    const classes = useStyles();

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: '#fff'
            },
            type: 'dark'
        }
    })

    const [coinsList, setCoinsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const {currency, symbol} = CryptoState();

    useEffect(() => {
        const fetchCoinsList = async () => {
            setLoading(true);
            const {data} = await axios.get(CoinList(currency));
    
            // console.log(data);
            const requiredData = data.map((coin) => {
                return({
                    id: coin.id,
                    name: coin.name,
                    logo: coin.image,
                    symbol: coin.symbol,
                    price: coin.current_price,
                    change: coin.price_change_percentage_24h.toFixed(2),
                    marketCap: coin.market_cap
                })
            })
    
            setCoinsList(requiredData);
            // console.log(data);
            setLoading(false);
        }

        fetchCoinsList();
    }, [currency]);

    const handleSearch = () => {
        return coinsList.filter((coin) => coin.name.toLowerCase().includes(search.toLowerCase()) || coin.symbol.toLowerCase().includes(search.toLowerCase()))
    }

    // console.log(coinsList);
    // console.log(search);
  return (
    <ThemeProvider theme={darkTheme}>
        <Container style={{textAlign: "center"}}>
            <Typography 
                varient="h4"
                style={{
                    fontWeight: "lighter",
                    fontSize: 22,
                    margin: 18,
                    fontFamily: "Poppins" 
                }}>
                Cryptocurrency Proces by Market Cap
            </Typography>

            <TextField
                label='Search crypto coin' 
                variant='outlined'
                style={{
                    width: '100%'
                }}
                onChange={(e) => setSearch(e.target.value)}
            />

            <TableContainer style={{
                                marginTop: 15,
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5}}>

                {loading ? (
                    <LinearProgress style={{backgroundColor: "gold"}}/>
                ) : (
                    <Table>
                    <TableHead style={{
                        backgroundColor: "#eebc1d"
                        }}>
                        <TableRow >
                            {["Coin", "Price", "24h Change", "Market Cap"].map((cell) => (
                                <TableCell style={{
                                    color: "black",
                                    fontSize: 18,
                                    fontWeight: "bold"
                                    }}
                                    align= {cell === "Coin" ? "left" : "right"}
                                    key={cell}
                                >
                                    {cell}
                                </TableCell>
                            ))}
                            
                            {/* <TableCell align='right'>Price</TableCell>
                            <TableCell align='right'>24h Change</TableCell>
                            <TableCell align='right'>Market Cap</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {handleSearch()
                            .slice((page-1)*10, (page-1)*10 +10)
                            .map((coin) => {
                            let profit = coin.change >= 0;
                            return(
                                <TableRow key={coin.id} onClick={() => navigate(`/coin/${coin.id}`)}
                                className={classes.row}>
                                    <TableCell 
                                        style={{
                                            display: 'flex',
                                            gap: 15,
                                            fontSize: 18
                                        }}
                                    >  
                                            <img className={classes.logo} alt={coin.name} src={coin.logo}/>
                                            <div className={classes.coinInfo}>
                                                <span>{(coin.symbol).toUpperCase()}</span>
                                                <span style={{color: 'grey', fontSize: 15}}>{coin.name}</span>
                                            </div>
                                        
                                    </TableCell>
                                        <TableCell 
                                            align='right'
                                            style={{fontSize: 16}}
                                        >
                                            {symbol} {numberWithCommas(coin.price)}
                                        </TableCell>
                                        <TableCell 
                                            align='right'
                                            style={{color: profit ? "green" : "red", fontSize: 16}}
                                        >
                                            {profit && "+"}{coin.change}%
                                        </TableCell>
                                        <TableCell 
                                            align='right'
                                            style={{fontSize: 16}}
                                        >
                                            {symbol} {numberWithCommas(coin.marketCap.toString().slice(0, -6))}M
                                        </TableCell>
                                </TableRow>
                            );
                        })}

                    </TableBody>
                </Table>
                )}
                
            </TableContainer>

            <Pagination
                className={classes.pagination} 
                classes={{ ul: classes.pageUL }}
                count={Number((handleSearch().length/10).toFixed(0))}
                page={page}
                onChange={(e, val) => {
                    setPage(val)
                    window.scroll(0,450)
                    }}/>

        </Container>
    </ThemeProvider>
  )
}

export default CoinsTable