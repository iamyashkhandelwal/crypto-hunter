import { LinearProgress, makeStyles, Typography } from '@material-ui/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SingleCoin } from '../api/CoinGekoAPI'
import { CryptoState } from '../CryptoContext'
import CoinChart from './CoinChart'

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    // margin: 25,
    fontFamily: "Poppins",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center"
    }
  },
  sidebar: {
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "100%"
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRightWidth: 2,
    borderRightColor: "grey",
    borderRightStyle: "solid",
    marginTop: 25
  },
  logo: {
    height: 200
  },
  heading: {
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Poppins"
  },
  desc: {
    width: "100%",
    padding: 25,
    paddingTop: 0,
    paddingBottom: 15,
    letterSpacing: 1.2,
    color: "lightgray",
    lineHeight: 1.7,
    textAlign: "justify"
  },
  marketData: {
    alignItems: "start",
    width: "100%",
    padding: 20,
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-around"
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
    [theme.breakpoints.down("xs")]: {
      alignItems: "start",
    },
  }
}))

const CoinPage = () => {

  const [coinData, setCoinData] = useState({});
  const {currency, symbol} = CryptoState();

  const classes = useStyles();

  const {id} = useParams();
  // console.log(id);

  useEffect(() => {
    const fetchCoinData = async () => {
      const {data} = await axios.get(SingleCoin(id));
  
      const requiredCoinData = {
        id: data.id,
        name: data.name,
        symbol: data.symbol,
        image: data.image.large,
        desc: data.description.en.split(". ")[0],
        rank: data.coingecko_rank,
        price: data.market_data.current_price[currency.toLowerCase()],
        marketCap: data.market_data.market_cap[currency.toLowerCase()].toString().slice(0, -6)
      }
  
      // console.log(requiredCoinData);
      setCoinData(requiredCoinData);
    }
  
    fetchCoinData();
  }, [currency])

  // console.log(Object.keys(coinData).length);
  // console.log(coinData);

  if(!Object.keys(coinData).length){
    return <LinearProgress style={{backgroundColor: "gold"}}/>
  }

  return (
    
    <div className={classes.container}>
      <div className={classes.sidebar}>
              <img
                alt={coinData.name}
                src={coinData?.image}
                className={classes.logo} />

              <Typography
                varient="h1"
                className={classes.heading}
                style={{ fontSize: 45 }}
              >
                {coinData?.name}
              </Typography>

              <Typography
                varient="subtitle1"
                className={classes.desc}
                dangerouslySetInnerHTML={{ __html: coinData.desc }}
              >
                {/* {coinData?.desc}. */}
              </Typography>

              <div className={classes.marketData}>
                <span style={{ display: "flex" }}>

                  <h2 className={classes.heading}>
                    Rank:
                  </h2>
                  &nbsp; &nbsp;
                  <h2 className={classes.heading}>
                    {coinData.rank}
                  </h2>
                </span>

                <span style={{ display: "flex" }}>
                  <h2 className={classes.heading}>
                    Current Price:
                  </h2>
                  &nbsp; &nbsp;
                  <h2 className={classes.heading}>
                    {symbol} {coinData.price}
                  </h2>
                </span>

                <span style={{ display: "flex" }}>
                  <h2 className={classes.heading}>
                    Market Cap:
                  </h2>
                  &nbsp; &nbsp;
                  <h2 className={classes.heading}>
                    {symbol} {coinData.marketCap}M
                  </h2>
                </span>
              </div>

            </div>
            <CoinChart id={id}/>

    </div>
    )
    
}

export default CoinPage


    
