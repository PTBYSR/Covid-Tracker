import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import './InfoBox.css'
import numeral from "numeral";

const InfoBox = ({ title, cases, active, isGreen, total, isRed, isAll, ...props}) => {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}` }>
            <CardContent>
                {!isAll &&
                <Typography className="infoBox__title">
                    {title}
                </Typography>
                
                }

                <h2 className={`infoBox__cases ${isGreen && 'infoBox__cases--green'} ${isAll && 'infoBox__all'}`}>
                    {!isAll? total : <strong>{numeral(total).format("0,0")}</strong>}
                    
                </h2>
                <Typography className="infoBox__total">
                    {!isAll? cases: <p>TOTAL CASES</p>}
                    
                </Typography>
            </CardContent>
        </Card>

    )
}

export default InfoBox
