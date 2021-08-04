import {PDPatternButton} from "./PDPatternButton";
import {Grid} from "@material-ui/core";

export function PDPatterns(props)
{
    return (
        <Grid
            container
            direction={"row"}
            justifyContent={"center"}
            spacing={2}>
            {
                Object.keys(props.buttons).map(id =>
                {
                    return <PDPatternButton id={id} text={props.buttons[id]} key={id} />
                })
            }
        </Grid>
    )
}