import { makeStyles } from '@material-ui/core';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { CryptoState } from '../../CryptoContext';
import { TrendingCoins } from '../../api/CoinGekoAPI';
import AliceCarousel from 'react-alice-carousel';
import { Link } from 'react-router-dom';
import 'react-alice-carousel/lib/alice-carousel.css';  //important

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}


const useStyles = makeStyles((theme) => ({
    carousel: {
        height: "50%",
        display: "flex",
        alignItems: "center",
      },
    carouselItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer",
      textTransform: "uppercase",
      color: "white",
    },
  }));

const Carousel = () => {

    const [trending, setTrending] = useState([])
    const classes = useStyles();
    const {currency, symbol} = CryptoState();

    useEffect(() => {
        const fetchTrendingCoins = async () => {
            const {data} = await axios.get(TrendingCoins(currency));
            setTrending(data);
            // console.log(data);
        }

        fetchTrendingCoins();
    }, [currency]);

    const responsive = {
        0: {
            items: 2,
        },
        512: {
            items: 4
        }
    };

    const items = trending.map((coin) => {

        let profit = coin.price_change_percentage_24h >= 0;

        return(
            <Link className={classes.carouselItem} to={`/coin/${coin.id}`}>
                <img 
                    src={coin.image}
                    alt={coin.name}
                    height="80"
                    style={{
                        marginBottom: 10
                    }}
                    />
                    <span>
                        {coin.symbol}
                        &nbsp;
                        <span style={{color: profit ? 'green' : 'red'}}>
                            {profit && "+"}{coin.price_change_percentage_24h.toFixed(2)}%
                        </span>
                    </span>
                    <span style={{fontSize: 22}}>
                        {symbol} {numberWithCommas(coin.current_price)}
                    </span>
                    
            </Link>
        )
    })

    // console.log(items);

  return (
    <div className={classes.carousel}>
        <AliceCarousel
            mouseTracking
            infinite
            autoPlayInterval={1000}
            animationDuration={1500}
            disableDotsControls
            disableButtonsControls
            responsive={responsive}
            autoPlay
            items={items} 
            />
    </div>
  )
}

export default Carousel;




