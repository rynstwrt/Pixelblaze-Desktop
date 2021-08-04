import { Grid, makeStyles } from "@material-ui/core";
import { PDSlider } from "./PDSlider";

export function PDInputs(props)
{
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
                Object.keys(props.sliders).map(sliderName =>
                {
                    return <PDSlider
                        key={sliderName}
                        text={sliderName
                            .replace("slider", "")
                            .replaceAll(/([A-Z])/g, " $1")
                            .toUpperCase() + ":"}
                        propertyName={sliderName}
                        initValue={props.sliders[sliderName]}/>
                })
            }
        </Grid>
    )
}