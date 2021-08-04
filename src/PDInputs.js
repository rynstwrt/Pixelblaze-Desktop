import { Grid, makeStyles } from "@material-ui/core";
import { PDSlider } from "./PDSlider";

export function PDInputs(props)
{
    const sliders = { ...{ "brightness": 1 }, ...props.sliders };

    const inputGridStyle = makeStyles({
        root: {
            margin: ".5rem 0 2rem 0"
        }
    });

    return (
        <Grid container
            direction={"row"}
            justifyContent={"center"}
            spacing={2}
            className={inputGridStyle().root}>
            {
                Object.keys(sliders).map(sliderName =>
                {
                    return <PDSlider
                        key={sliderName}
                        text={sliderName}
                        propertyName={sliderName}
                        initValue={sliders[sliderName]}/>
                })
            }
        </Grid>
    )
}

// export function PDInputs(props)
// {
//     if (props.sliders === undefined)
//     {
//         // TODO: get this initValue programmatically
//         return (
//             <Box display={"flex"} justifyContent={"space-evenly"} marginBottom={"4rem"}>
//                 {/*<PDSlider text={"BRIGHTNESS"} propertyName={"brightness"} initValue={1} />*/}
//             </Box>
//         )
//     }
//
//     return (
//         <Box display={"flex"} justifyContent={"space-evenly"} marginBottom={"4rem"}>
//             {
//                 Object.keys(props.sliders).map(propertyName =>
//                 {
//                     return <PDSlider key={propertyName} text={propertyName} propertyName={propertyName} initValue={props.sliders[propertyName]} />
//                 })
//             }
//         </Box>
//     )
// }