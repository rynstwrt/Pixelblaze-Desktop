import react from "react"
import { PDHeader } from "./PDHeader"
import {PDPatterns} from "./PDPatterns";

export class PDApp extends react.Component
{
    __isMounted = false;
    sliders = {};
    patternButtons = {};

    componentDidMount()
    {
        this.__isMounted = true;

        window.api.receive("create-pattern-buttons", programList =>
        {
            this.patternButtons = programList;
            this.forceUpdate();
        });

        window.api.receive("create-controls", controls =>
        {
            console.log("create-controls received");

            const ctrls = controls === undefined ? {} : controls;
            const ctrlKeys = Object.keys(ctrls);

            const slidersFiltered = ctrlKeys.filter(key => key.startsWith("slider"));

            this.sliders = { brightness: .5 };

            if (slidersFiltered.length === 0)
            {
                this.forceUpdate();
                return;
            }

            const reducedSliders = slidersFiltered.reduce((obj, key) =>
            {
                return { ...obj, [key]: ctrls[key] }
            }, {});

            this.sliders = { ...this.sliders, ...reducedSliders }

            this.forceUpdate();
            console.log("UPDATED SLIDERS");
        });
    }

    componentWillUnmount()
    {
        this.__isMounted = false;
    }

    render()
    {
        return (
            <div>
                <PDHeader sliders={this.sliders} />
                <PDPatterns buttons={this.patternButtons} />
            </div>
        )
    }
}
