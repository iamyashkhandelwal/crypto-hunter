import { Button, CircularProgress, makeStyles } from '@material-ui/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {Line} from 'react-chartjs-2'
import { HistoricalChart } from '../api/CoinGekoAPI'
import { CryptoState } from '../CryptoContext'
import Chart from 'chart.js/auto';

const chartDays = [
    {
      label: "24 Hours",
      value: 1,
    },
    {
      label: "30 Days",
      value: 30,
    },
    {
      label: "3 Months",
      value: 90,
    },
    {
      label: "1 Year",
      value: 365,
    },
  ];

const selectedButton = false;

const useStyles = makeStyles((theme) => ({
    container: {
        width: "75%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 25,
        padding: 40,
        [theme.breakpoints.down("md")]: {
            width: "100%",
            marginTop: 0,
            padding: 20,
            paddingTop: 0
        }
    },
    daysButton: {
        cursor: "pointer",
        width: "20%",
        padding: 12,
        borderRadius: 5,
        fontSize: 16,
        borderColor: "gold",
        backgroundColor: "transparent",
        color: "white",
        transition: "ease-in",
        "&:hover":{
            backgroundColor: "gold",
            color: "black",
            fontWeight: "bold",
        }
    }
}))

const CoinChart = ({id}) => {

    const [historicData, setHistoricData] = useState();
    const [days, setDays] = useState(1);
    const [flag, setFlag] = useState(false);

    const {currency, symbol} = CryptoState();
    const classes = useStyles();

    const fetchHistoricData = async () => {
        const { data } = await axios.get(HistoricalChart(id, days, currency))
        
        console.log(data);
        setHistoricData(data.prices);
    }

    console.log(days);

    useEffect(() => {
        fetchHistoricData();
        setFlag(true);
    }, [days])

    // console.log(historicData);

  return (
    <div className={classes.container}>
        {
            !historicData | flag === false 
            ? (<CircularProgress
                style={{color: "gold"}}
                size={250}
                thickness={1}
            />)
            : (
                <>
                    <Line
            data={{
                labels: historicData.map((coin) => {
                    let date = new Date(coin[0]);
                    let time = 
                        date.getHours() > 12
                        ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                        : `${date.getHours()}:${date.getMinutes()} AM`;
                    console.log(time);
                    return days === 1 ? time : date.toLocaleDateString();
                }),

                datasets: [
                    { 
                        data : historicData.map((coin) => coin[1]),
                        label: `Price ( Past ${days === 1 ? `${days} Day` : `${days} Days`}  ) in ${currency}`,
                        borderColor: "#eebc1d"
                }]
            }}
            
            options={{
                elements: {
                    point: {
                        radius: 1
                    }
                }
            }}
        />
        <div
            style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%"
            }}    
        >
            {
                chartDays.map((day) => (
                    <button
                        key={day.value}
                        className={classes.daysButton} 
                        onClick={() => {
                            setDays(day.value)
                            selectedButton = true}}
                    >
                        {day.label}
                    </button>
                ))
            }

        </div>
                </>
            )
        }   

    </div>
  )
}

export default CoinChart