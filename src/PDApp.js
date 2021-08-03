import react from "react"
import { PDHeader } from "./PDHeader"
import {PDPatterns} from "./PDPatterns";

let patternButtons = {};

export class PDApp extends react.Component
{
    __isMounted = false;

    componentDidMount()
    {
        this.__isMounted = true;

        window.api.receive("create-pattern-buttons", programList =>
        {
            patternButtons = programList;
            this.forceUpdate();
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
                <PDHeader/>
                <PDPatterns buttons={patternButtons}/>
            </div>
        )
    }
}
