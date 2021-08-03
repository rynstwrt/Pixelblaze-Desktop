import { Button, Grid, makeStyles } from "@material-ui/core";

const patternButtonStyle = makeStyles({
    root:
    {
        backgroundColor: "#F3F4F5",
        padding: ".75rem 2rem",
        width: "100%",
        maxWidth: "200px",

        "&:hover":
        {
            backgroundColor: "#FF6666"
        }
    }
})

export function PDPatternButton(props)
{
    return (
        <Grid item xs={4}>
            <div className={"button-wrapper"}>
                <Button
                    className={patternButtonStyle().root}
                    onClick={() => window.api.send("PD-pattern-button-clicked", props.id)}>
                    <p className={"pattern-button-text"} style={{textAlign: "center"}}>{ props.text }</p>
                </Button>
            </div>
        </Grid>
    )
}