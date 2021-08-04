import { makeStyles, Slider, Typography, Grid } from "@material-ui/core"

const typographyStyle = makeStyles({
    root: {
        marginRight: ".5rem"
    }
})

const sliderStyle = makeStyles({
    root: {
        color: "#FF6666",
        width: "100px"
    }
})

export function PDSlider(props)
{
    return (
        <Grid item xs={4} lg={3} xl={2}>
            <Typography id={"labeled-slider-label"} className={typographyStyle().root}>
                {props.text + ":"}
            </Typography>

            <Slider
                className={sliderStyle().root}
                aria-labelledby={"labeled-slider-label"}
                // defaultValue={props.initValue}
                defaultValue={.5}
                step={0.001}
                min={0}
                max={1}
                onChangeCommitted={(e, newValue) => window.api.send("PD-slider-changed", [newValue, props.propertyName])}
            />
        </Grid>
    )
}

// export function PDSlider(props)
// {
//     return (
//         <div className={"labeled-slider"}>
//             <Typography
//                 id={"labeled-slider-label"}
//                 className={typographyStyle().root}>
//                 {props.text + ":"}
//             </Typography>
//
//             <Slider
//                 className={sliderStyle().root}
//                 aria-labelledby={"labeled-slider-label"}
//                 defaultValue={props.initValue}
//                 step={0.001}
//                 min={0}
//                 max={1}
//                 onChangeCommitted={(e, newValue) => window.api.send("PD-slider-changed", [newValue, props.propertyName])}
//             />
//         </div>
//     )
// }